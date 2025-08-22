import { OpenAIService } from '../../src/features/openai/services/openaiService'
import { SystemConfiguration, SendMessageRequest } from '../../src/features/openai/types'

// Mock OpenAI
jest.mock('openai', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn(),
        },
      },
      models: {
        list: jest.fn().mockResolvedValue({ data: [] }),
      },
    })),
  }
})

describe('OpenAIService', () => {
  let service: OpenAIService
  let mockOpenAI: any

  const mockSystemConfig: SystemConfiguration = {
    role: 'system',
    specification: 'Test system specification',
    backgroundStory: 'Test background story',
    roleInstructions: 'Test role instructions',
    temperature: 0.7,
    maxTokens: 1000,
  }

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()
    
    // Create service instance
    service = new OpenAIService({
      apiKey: 'test-api-key',
      model: 'gpt-3.5-turbo',
    })

    // Get the mocked OpenAI instance
    const OpenAI = require('openai').default
    mockOpenAI = new OpenAI()
  })

  describe('sendMessage', () => {
    it('should successfully send a message and return response', async () => {
      // Mock OpenAI response
      const mockCompletion = {
        choices: [
          {
            message: {
              content: 'Test AI response',
            },
          },
        ],
        model: 'gpt-3.5-turbo',
        usage: {
          prompt_tokens: 50,
          completion_tokens: 25,
          total_tokens: 75,
        },
      }

      mockOpenAI.chat.completions.create.mockResolvedValueOnce(mockCompletion)

      const request: SendMessageRequest = {
        userMessage: 'Test user message',
        systemConfig: mockSystemConfig,
        chatHistory: [],
      }

      const result = await service.sendMessage(request)

      expect(result.success).toBe(true)
      expect(result.response.content).toBe('Test AI response')
      expect(result.response.model).toBe('gpt-3.5-turbo')
      expect(result.response.usage).toEqual({
        promptTokens: 50,
        completionTokens: 25,
        totalTokens: 75,
      })
      expect(result.chatHistory).toHaveLength(2) // user message + AI response
      expect(result.error).toBeUndefined()
    })

    it('should handle OpenAI API errors gracefully', async () => {
      // Mock API error
      const apiError = new Error('API rate limit exceeded')
      mockOpenAI.chat.completions.create.mockRejectedValueOnce(apiError)

      const request: SendMessageRequest = {
        userMessage: 'Test user message',
        systemConfig: mockSystemConfig,
        chatHistory: [],
      }

      const result = await service.sendMessage(request)

      expect(result.success).toBe(false)
      expect(result.error).toBe('API rate limit exceeded')
      expect(result.response.content).toBe(
        'Sorry, I encountered an error while processing your request.'
      )
    })

    it('should handle empty response content', async () => {
      // Mock empty response
      const mockCompletion = {
        choices: [
          {
            message: {
              content: null,
            },
          },
        ],
        model: 'gpt-3.5-turbo',
      }

      mockOpenAI.chat.completions.create.mockResolvedValueOnce(mockCompletion)

      const request: SendMessageRequest = {
        userMessage: 'Test user message',
        systemConfig: mockSystemConfig,
        chatHistory: [],
      }

      const result = await service.sendMessage(request)

      expect(result.success).toBe(false)
      expect(result.error).toBe('No response content received from OpenAI')
    })

    it('should include chat history in the request', async () => {
      const mockCompletion = {
        choices: [
          {
            message: {
              content: 'Test AI response',
            },
          },
        ],
        model: 'gpt-3.5-turbo',
      }

      mockOpenAI.chat.completions.create.mockResolvedValueOnce(mockCompletion)

      const chatHistory = [
        {
          id: '1',
          role: 'user' as const,
          content: 'Previous user message',
          timestamp: new Date(),
        },
        {
          id: '2',
          role: 'assistant' as const,
          content: 'Previous AI response',
          timestamp: new Date(),
        },
      ]

      const request: SendMessageRequest = {
        userMessage: 'New user message',
        systemConfig: mockSystemConfig,
        chatHistory,
      }

      await service.sendMessage(request)

      // Verify that chat history was included in the API call
      const callArgs = mockOpenAI.chat.completions.create.mock.calls[0][0]
      expect(callArgs.messages).toHaveLength(4) // system + 2 history + new user message
      expect(callArgs.messages[1].content).toBe('Previous user message')
      expect(callArgs.messages[2].content).toBe('Previous AI response')
    })

    it('should build system prompt correctly', async () => {
      const mockCompletion = {
        choices: [
          {
            message: {
              content: 'Test AI response',
            },
          },
        ],
        model: 'gpt-3.5-turbo',
      }

      mockOpenAI.chat.completions.create.mockResolvedValueOnce(mockCompletion)

      const request: SendMessageRequest = {
        userMessage: 'Test message',
        systemConfig: mockSystemConfig,
        chatHistory: [],
      }

      await service.sendMessage(request)

      const callArgs = mockOpenAI.chat.completions.create.mock.calls[0][0]
      const systemMessage = callArgs.messages[0]
      
      expect(systemMessage.role).toBe('system')
      expect(systemMessage.content).toContain('Test system specification')
      expect(systemMessage.content).toContain('Test background story')
      expect(systemMessage.content).toContain('Test role instructions')
    })
  })

  describe('testConnection', () => {
    it('should return success when connection is valid', async () => {
      mockOpenAI.models.list.mockResolvedValueOnce({ data: [] })

      const result = await service.testConnection()

      expect(result.success).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should return error when connection fails', async () => {
      const connectionError = new Error('Invalid API key')
      mockOpenAI.models.list.mockRejectedValueOnce(connectionError)

      const result = await service.testConnection()

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid API key')
    })
  })
})