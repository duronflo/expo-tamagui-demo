import { useState, useCallback, useEffect } from 'react'
import { OpenAIService } from '../services/openaiService'
import {
  ChatState,
  ChatActions,
  SystemConfiguration,
  ChatMessage,
  ChatContextType,
} from '../types'

// Default system configuration
const DEFAULT_SYSTEM_CONFIG: SystemConfiguration = {
  role: 'system',
  specification: 'You are a helpful AI assistant designed to provide accurate, informative, and friendly responses.',
  backgroundStory: 'You are an AI assistant created to help users with various tasks and questions.',
  roleInstructions: 'Be helpful, informative, and maintain a friendly tone. Provide clear and concise answers.',
  temperature: 0.7,
  maxTokens: 1000,
}

interface UseChatOptions {
  apiKey: string
  model?: string
  initialSystemConfig?: Partial<SystemConfiguration>
}

/**
 * useChat Hook
 * React hook for managing chat functionality with OpenAI
 */
export function useChat(options: UseChatOptions): ChatContextType {
  const { apiKey, model, initialSystemConfig } = options

  // Initialize OpenAI service
  const [openaiService] = useState(() => new OpenAIService({
    apiKey,
    model: model || 'gpt-3.5-turbo',
  }))

  // Chat state
  const [state, setState] = useState<ChatState>({
    messages: [],
    systemConfig: { ...DEFAULT_SYSTEM_CONFIG, ...initialSystemConfig },
    isLoading: false,
    error: null,
    sessionId: `session-${Date.now()}`,
  })

  // Send message action
  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return
    
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null 
    }))

    try {
      const response = await openaiService.sendMessage({
        userMessage: message.trim(),
        systemConfig: state.systemConfig,
        chatHistory: state.messages,
      })

      if (response.success) {
        setState(prev => ({
          ...prev,
          messages: response.chatHistory,
          isLoading: false,
        }))
      } else {
        setState(prev => ({
          ...prev,
          error: response.error || 'Failed to send message',
          isLoading: false,
        }))
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        isLoading: false,
      }))
    }
  }, [openaiService, state.systemConfig, state.messages])

  // Update system configuration
  const updateSystemConfig = useCallback((config: Partial<SystemConfiguration>) => {
    setState(prev => ({
      ...prev,
      systemConfig: { ...prev.systemConfig, ...config },
    }))
  }, [])

  // Clear chat history
  const clearChat = useCallback(() => {
    setState(prev => ({
      ...prev,
      messages: [],
      error: null,
      sessionId: `session-${Date.now()}`,
    }))
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  // Test connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const result = await openaiService.testConnection()
        if (!result.success) {
          setState(prev => ({
            ...prev,
            error: `Connection failed: ${result.error}`,
          }))
        }
      } catch (error) {
        console.error('Connection test error:', error)
      }
    }

    if (apiKey) {
      testConnection()
    } else {
      setState(prev => ({
        ...prev,
        error: 'OpenAI API key is required',
      }))
    }
  }, [apiKey, openaiService])

  return {
    ...state,
    sendMessage,
    updateSystemConfig,
    clearChat,
    clearError,
  }
}

/**
 * Hook for managing just the system configuration
 */
export function useSystemConfig(initialConfig?: Partial<SystemConfiguration>) {
  const [config, setConfig] = useState<SystemConfiguration>({
    ...DEFAULT_SYSTEM_CONFIG,
    ...initialConfig,
  })

  const updateConfig = useCallback((updates: Partial<SystemConfiguration>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }, [])

  const resetConfig = useCallback(() => {
    setConfig({ ...DEFAULT_SYSTEM_CONFIG, ...initialConfig })
  }, [initialConfig])

  return {
    config,
    updateConfig,
    resetConfig,
  }
}