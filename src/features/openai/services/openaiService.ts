import OpenAI from 'openai'
import { 
  SendMessageRequest, 
  SendMessageResponse, 
  ChatMessage, 
  AIResponse, 
  OpenAIServiceConfig 
} from '../types'

/**
 * OpenAI Service
 * Handles communication with OpenAI API with proper error handling and type safety
 */
export class OpenAIService {
  private client: OpenAI
  private config: OpenAIServiceConfig

  constructor(config: OpenAIServiceConfig) {
    this.config = {
      model: 'gpt-3.5-turbo',
      ...config,
    }
    
    this.client = new OpenAI({
      apiKey: this.config.apiKey,
      baseURL: this.config.baseURL,
      dangerouslyAllowBrowser: true, // Required for client-side usage
    })
  }

  /**
   * Send a message to OpenAI and get response
   * @param request - The message request with user input and system configuration
   * @returns Promise with the AI response and updated chat history
   */
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      const { userMessage, systemConfig, chatHistory = [] } = request

      // Create the user message
      const userChatMessage: ChatMessage = {
        id: this.generateId(),
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      }

      // Prepare messages for OpenAI API
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: this.buildSystemPrompt(systemConfig),
        },
        // Include chat history for context
        ...chatHistory.map(msg => ({
          role: msg.role as 'system' | 'user' | 'assistant',
          content: msg.content,
        })),
        {
          role: 'user',
          content: userMessage,
        },
      ]

      // Call OpenAI API
      const completion = await this.client.chat.completions.create({
        model: this.config.model!,
        messages,
        temperature: systemConfig.temperature ?? 0.7,
        max_tokens: systemConfig.maxTokens ?? 1000,
      })

      const assistantMessage = completion.choices[0]?.message
      
      if (!assistantMessage?.content) {
        throw new Error('No response content received from OpenAI')
      }

      // Create AI response object
      const aiResponse: AIResponse = {
        id: this.generateId(),
        content: assistantMessage.content,
        timestamp: new Date(),
        model: completion.model,
        usage: completion.usage ? {
          promptTokens: completion.usage.prompt_tokens,
          completionTokens: completion.usage.completion_tokens,
          totalTokens: completion.usage.total_tokens,
        } : undefined,
      }

      // Create assistant chat message
      const assistantChatMessage: ChatMessage = {
        id: aiResponse.id,
        role: 'assistant',
        content: assistantMessage.content,
        timestamp: aiResponse.timestamp,
      }

      // Update chat history
      const updatedChatHistory = [
        ...chatHistory,
        userChatMessage,
        assistantChatMessage,
      ]

      return {
        response: aiResponse,
        chatHistory: updatedChatHistory,
        success: true,
      }
    } catch (error) {
      console.error('OpenAI Service Error:', error)
      
      // Return error response
      return {
        response: {
          id: this.generateId(),
          content: 'Sorry, I encountered an error while processing your request.',
          timestamp: new Date(),
          model: this.config.model!,
        },
        chatHistory: request.chatHistory || [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Build system prompt from configuration
   */
  private buildSystemPrompt(config: SystemConfiguration): string {
    const parts: string[] = []
    
    if (config.specification) {
      parts.push(`System Specification: ${config.specification}`)
    }
    
    if (config.backgroundStory) {
      parts.push(`Background: ${config.backgroundStory}`)
    }
    
    if (config.roleInstructions) {
      parts.push(`Role Instructions: ${config.roleInstructions}`)
    }
    
    return parts.join('\n\n')
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Test connection to OpenAI API
   */
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      await this.client.models.list()
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Connection test failed' 
      }
    }
  }
}

// Import the SystemConfiguration type
import type { SystemConfiguration } from '../types'