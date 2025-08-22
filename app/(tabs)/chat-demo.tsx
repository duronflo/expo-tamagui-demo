import React, { useState } from 'react'
import { YStack, XStack, Text, Button, H3, H4, Card, ScrollView, Paragraph, Input, TextArea, Spinner } from '@my/ui'
import { Key, Send, MessageCircle, Settings, Trash2, Copy } from '@tamagui/lucide-icons'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface SystemConfig {
  specification: string
  backgroundStory: string
  roleInstructions: string
  temperature: number
  maxTokens: number
}

export default function ChatTabScreen() {
  const [apiKey, setApiKey] = useState('')
  const [isApiKeySet, setIsApiKeySet] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSystemConfig, setShowSystemConfig] = useState(false)
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    specification: 'You are a helpful AI assistant designed to provide accurate, informative, and friendly responses.',
    backgroundStory: 'You are an AI assistant created to help users with various tasks and questions.',
    roleInstructions: 'Be helpful, informative, and maintain a friendly tone. Provide clear and concise answers.',
    temperature: 0.7,
    maxTokens: 1000,
  })

  const handleSetApiKey = () => {
    if (apiKey.trim()) {
      setIsApiKeySet(true)
    }
  }

  const handleSendMessage = async () => {
    if (!userInput.trim()) return
    
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, newMessage])
    setIsLoading(true)
    
    // Simulate AI response for demo
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `This is a demo response to: "${userInput}". In a real implementation, this would connect to OpenAI API using the provided API key and system configuration.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 2000)
    
    setUserInput('')
  }

  const handleCopyMessage = (content: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(content)
      alert('Message copied to clipboard')
    }
  }

  const clearMessages = () => {
    setMessages([])
  }

  if (!isApiKeySet) {
    return (
      <YStack f={1} bg="$background" ai="center" jc="center" p="$4" gap="$4">
        <Key size="$6" color="$color10" />
        <H3 ta="center">OpenAI API Configuration</H3>
        <Text ta="center" color="$color10" fontSize="$4" maxWidth={300}>
          Enter your OpenAI API key to start chatting with the AI assistant
        </Text>
        
        <YStack gap="$3" width="100%" maxWidth={400}>
          <Input.Box size="$4">
            <Input.Area
              placeholder="sk-..."
              value={apiKey}
              onChangeText={setApiKey}
              secureTextEntry
            />
          </Input.Box>
          <Button
            bg="$blue8"
            color="$blue12"
            onPress={handleSetApiKey}
            disabled={!apiKey.trim()}
            size="$4"
          >
            Set API Key
          </Button>
        </YStack>
        
        <Text fontSize="$2" color="$color8" ta="center" maxWidth={300}>
          Your API key is stored locally and never shared. Get your key from{' '}
          <Text color="$blue10">platform.openai.com</Text>
        </Text>
      </YStack>
    )
  }

  return (
    <YStack f={1} bg="$background" p="$4" gap="$4">
      {/* Header */}
      <XStack ai="center" jc="space-between">
        <H3>AI Chat Assistant</H3>
        <XStack gap="$2">
          <Button
            size="$3"
            variant="outlined"
            onPress={() => setShowSystemConfig(!showSystemConfig)}
            icon={Settings}
            bg={showSystemConfig ? "$blue8" : undefined}
          >
            Config
          </Button>
          <Button
            size="$3"
            variant="outlined"
            onPress={clearMessages}
            icon={Trash2}
          >
            Clear
          </Button>
        </XStack>
      </XStack>

      {/* System Configuration Panel */}
      {showSystemConfig && (
        <Card p="$4" bg="$color2" br="$4">
          <H4 mb="$3">System Configuration</H4>
          <YStack gap="$3">
            <YStack gap="$2">
              <Text fontSize="$3" fontWeight="600">System Specification</Text>
              <TextArea
                placeholder="Define the AI system's core purpose and capabilities..."
                value={systemConfig.specification}
                onChangeText={(text) => 
                  setSystemConfig(prev => ({ ...prev, specification: text }))
                }
                minHeight={80}
              />
            </YStack>
            
            <YStack gap="$2">
              <Text fontSize="$3" fontWeight="600">Background Story</Text>
              <TextArea
                placeholder="Provide context and background for the AI..."
                value={systemConfig.backgroundStory}
                onChangeText={(text) => 
                  setSystemConfig(prev => ({ ...prev, backgroundStory: text }))
                }
                minHeight={60}
              />
            </YStack>
            
            <YStack gap="$2">
              <Text fontSize="$3" fontWeight="600">Role Instructions</Text>
              <TextArea
                placeholder="Specific instructions for how the AI should behave..."
                value={systemConfig.roleInstructions}
                onChangeText={(text) => 
                  setSystemConfig(prev => ({ ...prev, roleInstructions: text }))
                }
                minHeight={60}
              />
            </YStack>

            <XStack gap="$4">
              <YStack f={1} gap="$2">
                <Text fontSize="$3" fontWeight="600">Temperature</Text>
                <Input.Box>
                  <Input.Area
                    placeholder="0.7"
                    value={systemConfig.temperature.toString()}
                    onChangeText={(text) => 
                      setSystemConfig(prev => ({ 
                        ...prev, 
                        temperature: parseFloat(text) || 0.7 
                      }))
                    }
                  />
                </Input.Box>
              </YStack>
              
              <YStack f={1} gap="$2">
                <Text fontSize="$3" fontWeight="600">Max Tokens</Text>
                <Input.Box>
                  <Input.Area
                    placeholder="1000"
                    value={systemConfig.maxTokens.toString()}
                    onChangeText={(text) => 
                      setSystemConfig(prev => ({ 
                        ...prev, 
                        maxTokens: parseInt(text) || 1000 
                      }))
                    }
                  />
                </Input.Box>
              </YStack>
            </XStack>

            <XStack gap="$2" mt="$2">
              <Button
                f={1}
                bg="$green8"
                color="$green12"
                onPress={() => {
                  setShowSystemConfig(false)
                  alert('System configuration updated')
                }}
              >
                Update Configuration
              </Button>
              <Button
                variant="outlined"
                onPress={() => setShowSystemConfig(false)}
              >
                Cancel
              </Button>
            </XStack>
          </YStack>
        </Card>
      )}

      {/* Chat Messages */}
      <Card f={1} p="$4" bg="$color1" br="$4">
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack gap="$3">
            {messages.length === 0 ? (
              <YStack ai="center" jc="center" f={1} gap="$3" py="$8">
                <MessageCircle size="$6" color="$color10" />
                <Text color="$color10" fontSize="$4" ta="center">
                  Start a conversation with your AI assistant
                </Text>
                <Text color="$color8" fontSize="$3" ta="center">
                  Configure the system settings above and type your message below
                </Text>
              </YStack>
            ) : (
              messages.map((message) => (
                <Card
                  key={message.id}
                  p="$3"
                  bg={message.role === 'user' ? '$blue3' : '$color3'}
                  br="$3"
                  alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
                  maxWidth="80%"
                >
                  <XStack ai="flex-start" jc="space-between" gap="$2">
                    <YStack f={1} gap="$1">
                      <Text
                        fontSize="$2"
                        fontWeight="600"
                        color={message.role === 'user' ? '$blue11' : '$color11'}
                      >
                        {message.role === 'user' ? 'You' : 'Assistant'}
                      </Text>
                      <Paragraph
                        fontSize="$3"
                        color={message.role === 'user' ? '$blue12' : '$color12'}
                      >
                        {message.content}
                      </Paragraph>
                      <Text
                        fontSize="$1"
                        color={message.role === 'user' ? '$blue9' : '$color9'}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </Text>
                    </YStack>
                    <Button
                      size="$2"
                      variant="outlined"
                      onPress={() => handleCopyMessage(message.content)}
                      icon={Copy}
                      opacity={0.7}
                    />
                  </XStack>
                </Card>
              ))
            )}
            
            {isLoading && (
              <Card p="$3" bg="$color3" br="$3" alignSelf="flex-start" maxWidth="80%">
                <XStack ai="center" gap="$2">
                  <Spinner size="small" />
                  <Text color="$color11" fontSize="$3">
                    Assistant is thinking...
                  </Text>
                </XStack>
              </Card>
            )}
          </YStack>
        </ScrollView>
      </Card>

      {/* Message Input */}
      <Card p="$3" bg="$color2" br="$4">
        <XStack gap="$2" ai="flex-end">
          <YStack f={1} gap="$2">
            <TextArea
              placeholder="Type your message here..."
              value={userInput}
              onChangeText={setUserInput}
              minHeight={60}
              maxHeight={120}
              disabled={isLoading}
            />
          </YStack>
          <Button
            bg="$blue8"
            color="$blue12"
            icon={Send}
            disabled={!userInput.trim() || isLoading}
            onPress={handleSendMessage}
            size="$4"
            circular
          />
        </XStack>
      </Card>
    </YStack>
  )
}