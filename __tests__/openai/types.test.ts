import {
  SystemConfiguration,
  UserMessage,
  AIResponse,
  ChatMessage,
  SendMessageRequest,
  SendMessageResponse,
  OpenAIServiceConfig,
  ChatState,
  ChatActions,
  ChatContextType,
} from '../../src/features/openai/types'

describe('OpenAI Types', () => {
  it('should validate SystemConfiguration type', () => {
    const config: SystemConfiguration = {
      role: 'system',
      specification: 'Test spec',
      backgroundStory: 'Test story',
      roleInstructions: 'Test instructions',
      temperature: 0.7,
      maxTokens: 1000,
    }

    expect(config.role).toBe('system')
    expect(typeof config.specification).toBe('string')
    expect(typeof config.backgroundStory).toBe('string')
    expect(typeof config.roleInstructions).toBe('string')
    expect(typeof config.temperature).toBe('number')
    expect(typeof config.maxTokens).toBe('number')
  })

  it('should validate UserMessage type', () => {
    const userMessage: UserMessage = {
      id: 'user-1',
      content: 'Hello, AI!',
      timestamp: new Date(),
      metadata: { source: 'web' },
    }

    expect(typeof userMessage.id).toBe('string')
    expect(typeof userMessage.content).toBe('string')
    expect(userMessage.timestamp).toBeInstanceOf(Date)
    expect(typeof userMessage.metadata).toBe('object')
  })

  it('should validate AIResponse type', () => {
    const aiResponse: AIResponse = {
      id: 'ai-1',
      content: 'Hello, human!',
      timestamp: new Date(),
      model: 'gpt-3.5-turbo',
      usage: {
        promptTokens: 10,
        completionTokens: 20,
        totalTokens: 30,
      },
      metadata: { version: '1.0' },
    }

    expect(typeof aiResponse.id).toBe('string')
    expect(typeof aiResponse.content).toBe('string')
    expect(aiResponse.timestamp).toBeInstanceOf(Date)
    expect(typeof aiResponse.model).toBe('string')
    expect(typeof aiResponse.usage?.promptTokens).toBe('number')
    expect(typeof aiResponse.usage?.completionTokens).toBe('number')
    expect(typeof aiResponse.usage?.totalTokens).toBe('number')
  })

  it('should validate ChatMessage type', () => {
    const chatMessage: ChatMessage = {
      id: 'chat-1',
      role: 'user',
      content: 'Test message',
      timestamp: new Date(),
    }

    expect(typeof chatMessage.id).toBe('string')
    expect(['system', 'user', 'assistant'].includes(chatMessage.role)).toBe(true)
    expect(typeof chatMessage.content).toBe('string')
    expect(chatMessage.timestamp).toBeInstanceOf(Date)
  })

  it('should validate SendMessageRequest type', () => {
    const request: SendMessageRequest = {
      userMessage: 'Test message',
      systemConfig: {
        role: 'system',
        specification: 'Test spec',
        backgroundStory: 'Test story',
        roleInstructions: 'Test instructions',
      },
      chatHistory: [],
    }

    expect(typeof request.userMessage).toBe('string')
    expect(typeof request.systemConfig).toBe('object')
    expect(Array.isArray(request.chatHistory)).toBe(true)
  })

  it('should validate SendMessageResponse type', () => {
    const response: SendMessageResponse = {
      response: {
        id: 'ai-1',
        content: 'AI response',
        timestamp: new Date(),
        model: 'gpt-3.5-turbo',
      },
      chatHistory: [],
      success: true,
      error: undefined,
    }

    expect(typeof response.response).toBe('object')
    expect(Array.isArray(response.chatHistory)).toBe(true)
    expect(typeof response.success).toBe('boolean')
  })

  it('should validate OpenAIServiceConfig type', () => {
    const config: OpenAIServiceConfig = {
      apiKey: 'sk-test-key',
      model: 'gpt-3.5-turbo',
      baseURL: 'https://api.openai.com',
    }

    expect(typeof config.apiKey).toBe('string')
    expect(typeof config.model).toBe('string')
    expect(typeof config.baseURL).toBe('string')
  })

  it('should validate ChatState type', () => {
    const state: ChatState = {
      messages: [],
      systemConfig: {
        role: 'system',
        specification: 'Test spec',
        backgroundStory: 'Test story',
        roleInstructions: 'Test instructions',
      },
      isLoading: false,
      error: null,
      sessionId: 'session-1',
    }

    expect(Array.isArray(state.messages)).toBe(true)
    expect(typeof state.systemConfig).toBe('object')
    expect(typeof state.isLoading).toBe('boolean')
    expect(state.error === null || typeof state.error === 'string').toBe(true)
    expect(typeof state.sessionId).toBe('string')
  })

  it('should validate ChatActions type', () => {
    const actions: ChatActions = {
      sendMessage: jest.fn(),
      updateSystemConfig: jest.fn(),
      clearChat: jest.fn(),
      clearError: jest.fn(),
    }

    expect(typeof actions.sendMessage).toBe('function')
    expect(typeof actions.updateSystemConfig).toBe('function')
    expect(typeof actions.clearChat).toBe('function')
    expect(typeof actions.clearError).toBe('function')
  })

  it('should validate ChatContextType combines state and actions', () => {
    const context: ChatContextType = {
      // State
      messages: [],
      systemConfig: {
        role: 'system',
        specification: 'Test spec',
        backgroundStory: 'Test story',
        roleInstructions: 'Test instructions',
      },
      isLoading: false,
      error: null,
      sessionId: 'session-1',
      // Actions
      sendMessage: jest.fn(),
      updateSystemConfig: jest.fn(),
      clearChat: jest.fn(),
      clearError: jest.fn(),
    }

    // Test state properties
    expect(Array.isArray(context.messages)).toBe(true)
    expect(typeof context.systemConfig).toBe('object')
    expect(typeof context.isLoading).toBe('boolean')
    expect(typeof context.sessionId).toBe('string')

    // Test action properties
    expect(typeof context.sendMessage).toBe('function')
    expect(typeof context.updateSystemConfig).toBe('function')
    expect(typeof context.clearChat).toBe('function')
    expect(typeof context.clearError).toBe('function')
  })

  it('should allow optional properties in types', () => {
    // Test optional properties in SystemConfiguration
    const minimalConfig: SystemConfiguration = {
      role: 'system',
      specification: 'Test spec',
      backgroundStory: 'Test story',
      roleInstructions: 'Test instructions',
      // temperature and maxTokens are optional
    }

    expect(minimalConfig.temperature).toBeUndefined()
    expect(minimalConfig.maxTokens).toBeUndefined()

    // Test optional properties in AIResponse
    const minimalResponse: AIResponse = {
      id: 'ai-1',
      content: 'Response',
      timestamp: new Date(),
      model: 'gpt-3.5-turbo',
      // usage and metadata are optional
    }

    expect(minimalResponse.usage).toBeUndefined()
    expect(minimalResponse.metadata).toBeUndefined()
  })
})