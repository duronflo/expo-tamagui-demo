import { renderHook, act } from '@testing-library/react-hooks'
import { useChat } from '../../src/features/openai/hooks/useChat'
import { OpenAIService } from '../../src/features/openai/services/openaiService'

// Mock the OpenAIService
jest.mock('../../src/features/openai/services/openaiService')

describe('useChat Hook', () => {
  const mockOpenAIService = {
    sendMessage: jest.fn(),
    testConnection: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(OpenAIService as jest.MockedClass<typeof OpenAIService>).mockImplementation(
      () => mockOpenAIService as any
    )
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() =>
      useChat({
        apiKey: 'test-key',
        model: 'gpt-3.5-turbo',
      })
    )

    expect(result.current.messages).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.sessionId).toMatch(/^session-\d+$/)
    expect(result.current.systemConfig).toBeDefined()
  })

  it('should initialize with custom system config', () => {
    const customConfig = {
      specification: 'Custom specification',
      backgroundStory: 'Custom background',
    }

    const { result } = renderHook(() =>
      useChat({
        apiKey: 'test-key',
        initialSystemConfig: customConfig,
      })
    )

    expect(result.current.systemConfig.specification).toBe('Custom specification')
    expect(result.current.systemConfig.backgroundStory).toBe('Custom background')
  })

  it('should send message successfully', async () => {
    const mockResponse = {
      success: true,
      response: {
        id: 'response-1',
        content: 'AI response',
        timestamp: new Date(),
        model: 'gpt-3.5-turbo',
      },
      chatHistory: [
        {
          id: 'user-1',
          role: 'user' as const,
          content: 'Test message',
          timestamp: new Date(),
        },
        {
          id: 'response-1',
          role: 'assistant' as const,
          content: 'AI response',
          timestamp: new Date(),
        },
      ],
    }

    mockOpenAIService.sendMessage.mockResolvedValueOnce(mockResponse)
    mockOpenAIService.testConnection.mockResolvedValueOnce({ success: true })

    const { result, waitForNextUpdate } = renderHook(() =>
      useChat({
        apiKey: 'test-key',
      })
    )

    act(() => {
      result.current.sendMessage('Test message')
    })

    expect(result.current.isLoading).toBe(true)

    await waitForNextUpdate()

    expect(result.current.isLoading).toBe(false)
    expect(result.current.messages).toHaveLength(2)
    expect(result.current.messages[0].content).toBe('Test message')
    expect(result.current.messages[1].content).toBe('AI response')
    expect(result.current.error).toBe(null)
  })

  it('should handle send message error', async () => {
    const mockErrorResponse = {
      success: false,
      error: 'API error occurred',
      response: {
        id: 'error-1',
        content: 'Error response',
        timestamp: new Date(),
        model: 'gpt-3.5-turbo',
      },
      chatHistory: [],
    }

    mockOpenAIService.sendMessage.mockResolvedValueOnce(mockErrorResponse)
    mockOpenAIService.testConnection.mockResolvedValueOnce({ success: true })

    const { result, waitForNextUpdate } = renderHook(() =>
      useChat({
        apiKey: 'test-key',
      })
    )

    act(() => {
      result.current.sendMessage('Test message')
    })

    await waitForNextUpdate()

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe('API error occurred')
    expect(result.current.messages).toHaveLength(0)
  })

  it('should handle service rejection', async () => {
    mockOpenAIService.sendMessage.mockRejectedValueOnce(new Error('Network error'))
    mockOpenAIService.testConnection.mockResolvedValueOnce({ success: true })

    const { result, waitForNextUpdate } = renderHook(() =>
      useChat({
        apiKey: 'test-key',
      })
    )

    act(() => {
      result.current.sendMessage('Test message')
    })

    await waitForNextUpdate()

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe('Network error')
  })

  it('should not send empty messages', () => {
    mockOpenAIService.testConnection.mockResolvedValueOnce({ success: true })

    const { result } = renderHook(() =>
      useChat({
        apiKey: 'test-key',
      })
    )

    act(() => {
      result.current.sendMessage('   ')
    })

    expect(result.current.isLoading).toBe(false)
    expect(mockOpenAIService.sendMessage).not.toHaveBeenCalled()
  })

  it('should update system configuration', () => {
    mockOpenAIService.testConnection.mockResolvedValueOnce({ success: true })

    const { result } = renderHook(() =>
      useChat({
        apiKey: 'test-key',
      })
    )

    act(() => {
      result.current.updateSystemConfig({
        specification: 'Updated specification',
        temperature: 0.9,
      })
    })

    expect(result.current.systemConfig.specification).toBe('Updated specification')
    expect(result.current.systemConfig.temperature).toBe(0.9)
  })

  it('should clear chat', () => {
    mockOpenAIService.testConnection.mockResolvedValueOnce({ success: true })

    const { result } = renderHook(() =>
      useChat({
        apiKey: 'test-key',
      })
    )

    // Simulate having messages
    act(() => {
      result.current.messages.push({
        id: '1',
        role: 'user',
        content: 'Test',
        timestamp: new Date(),
      })
    })

    act(() => {
      result.current.clearChat()
    })

    expect(result.current.messages).toEqual([])
    expect(result.current.error).toBe(null)
    expect(result.current.sessionId).toMatch(/^session-\d+$/)
  })

  it('should clear error', () => {
    mockOpenAIService.testConnection.mockResolvedValueOnce({ success: true })

    const { result } = renderHook(() =>
      useChat({
        apiKey: 'test-key',
      })
    )

    // Simulate having an error
    act(() => {
      ;(result.current as any).error = 'Test error'
    })

    act(() => {
      result.current.clearError()
    })

    expect(result.current.error).toBe(null)
  })

  it('should handle connection test failure', async () => {
    mockOpenAIService.testConnection.mockResolvedValueOnce({
      success: false,
      error: 'Invalid API key',
    })

    const { result, waitForNextUpdate } = renderHook(() =>
      useChat({
        apiKey: 'invalid-key',
      })
    )

    await waitForNextUpdate()

    expect(result.current.error).toContain('Invalid API key')
  })

  it('should show error when no API key provided', () => {
    const { result } = renderHook(() =>
      useChat({
        apiKey: '',
      })
    )

    expect(result.current.error).toBe('OpenAI API key is required')
  })
})