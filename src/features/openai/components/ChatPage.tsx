import React, { useState } from 'react'
import { 
  YStack, 
  XStack, 
  Text, 
  Button,
  ScrollView,
  H3,
  H4,
  Paragraph,
  Card,
  Input,
  TextArea,
  Separator,
  Spinner,
} from '@my/ui'
import { Send, MessageCircle, Settings, Trash2, Copy } from '@tamagui/lucide-icons'
import { useChat } from '../hooks/useChat'
import { SystemConfiguration } from '../types'

interface ChatPageProps {
  apiKey: string
}

export function ChatPage({ apiKey }: ChatPageProps) {
  const [userInput, setUserInput] = useState('')
  const [showSystemConfig, setShowSystemConfig] = useState(false)
  
  // System configuration state
  const [systemConfig, setSystemConfig] = useState<SystemConfiguration>({
    role: 'system',
    specification: 'You are a helpful AI assistant designed to provide accurate, informative, and friendly responses.',
    backgroundStory: 'You are an AI assistant created to help users with various tasks and questions.',
    roleInstructions: 'Be helpful, informative, and maintain a friendly tone. Provide clear and concise answers.',
    temperature: 0.7,
    maxTokens: 1000,
  })

  const chat = useChat({
    apiKey,
    model: 'gpt-3.5-turbo',
    initialSystemConfig: systemConfig,
  })

  const handleSendMessage = async () => {
    if (!userInput.trim()) return
    
    await chat.sendMessage(userInput)
    setUserInput('')
  }

  const handleUpdateSystemConfig = () => {
    chat.updateSystemConfig(systemConfig)
    setShowSystemConfig(false)
    // Simple alert for now instead of toast
    alert('System configuration updated')
  }

  const handleCopyMessage = (content: string) => {
    // For web, we can use the clipboard API
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(content)
      alert('Message copied to clipboard')
    }
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
            onPress={chat.clearChat}
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
                    value={systemConfig.temperature?.toString() || '0.7'}
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
                    value={systemConfig.maxTokens?.toString() || '1000'}
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
                onPress={handleUpdateSystemConfig}
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

      {/* Error Display */}
      {chat.error && (
        <Card p="$3" bg="$red2" br="$4" borderColor="$red6" borderWidth={1}>
          <XStack ai="center" jc="space-between">
            <Text color="$red11" fontSize="$3">
              {chat.error}
            </Text>
            <Button
              size="$2"
              variant="outlined"
              onPress={chat.clearError}
              color="$red11"
            >
              ✕
            </Button>
          </XStack>
        </Card>
      )}

      {/* Chat Messages */}
      <Card f={1} p="$4" bg="$color1" br="$4">
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack gap="$3">
            {chat.messages.length === 0 ? (
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
              chat.messages
                .filter(message => message.role !== 'system')
                .map((message) => (
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
            
            {chat.isLoading && (
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
              disabled={chat.isLoading}
            />
          </YStack>
          <Button
            bg="$blue8"
            color="$blue12"
            icon={Send}
            disabled={!userInput.trim() || chat.isLoading}
            onPress={handleSendMessage}
            size="$4"
            circular
          />
        </XStack>
      </Card>

    </YStack>
  )
}