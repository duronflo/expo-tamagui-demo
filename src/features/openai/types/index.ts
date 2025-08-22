/**
 * OpenAI Chat Feature Types
 * Defines TypeScript interfaces for the chat system with type safety
 */

export interface SystemConfiguration {
  /** System role definition (e.g., "assistant", "user", "system") */
  role: 'system' | 'assistant' | 'user'
  /** System specification and rules */
  specification: string
  /** Background story or context */
  backgroundStory: string
  /** Specific role instructions */
  roleInstructions: string
  /** Temperature setting for AI responses (0-2) */
  temperature?: number
  /** Maximum tokens for response */
  maxTokens?: number
}

export interface UserMessage {
  /** Unique identifier for the message */
  id: string
  /** Message content */
  content: string
  /** Timestamp when message was sent */
  timestamp: Date
  /** Optional metadata */
  metadata?: Record<string, any>
}

export interface AIResponse {
  /** Unique identifier for the response */
  id: string
  /** AI response content */
  content: string
  /** Timestamp when response was received */
  timestamp: Date
  /** Model used for the response */
  model: string
  /** Token usage information */
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  /** Response metadata */
  metadata?: Record<string, any>
}

export interface ChatMessage {
  /** Message ID */
  id: string
  /** Role of the message sender */
  role: 'system' | 'user' | 'assistant'
  /** Message content */
  content: string
  /** Timestamp */
  timestamp: Date
}

export interface ChatHistory {
  /** Array of chat messages */
  messages: ChatMessage[]
  /** System configuration used */
  systemConfig: SystemConfiguration
  /** Session ID */
  sessionId: string
}

export interface SendMessageRequest {
  /** User message to send */
  userMessage: string
  /** System configuration */
  systemConfig: SystemConfiguration
  /** Optional chat history for context */
  chatHistory?: ChatMessage[]
}

export interface SendMessageResponse {
  /** AI response */
  response: AIResponse
  /** Updated chat history */
  chatHistory: ChatMessage[]
  /** Success status */
  success: boolean
  /** Error message if any */
  error?: string
}

export interface OpenAIServiceConfig {
  /** OpenAI API key */
  apiKey: string
  /** Model to use (default: gpt-3.5-turbo) */
  model?: string
  /** Base URL for API (optional) */
  baseURL?: string
}

export interface ChatState {
  /** Current chat messages */
  messages: ChatMessage[]
  /** System configuration */
  systemConfig: SystemConfiguration
  /** Loading state */
  isLoading: boolean
  /** Error state */
  error: string | null
  /** Session ID */
  sessionId: string
}

export interface ChatActions {
  /** Send a message */
  sendMessage: (message: string) => Promise<void>
  /** Update system configuration */
  updateSystemConfig: (config: Partial<SystemConfiguration>) => void
  /** Clear chat history */
  clearChat: () => void
  /** Reset error state */
  clearError: () => void
}

export type ChatContextType = ChatState & ChatActions