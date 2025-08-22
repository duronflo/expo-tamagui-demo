import React, { useState } from 'react'
import { YStack, XStack, Text, Button, H3, Input } from '@my/ui'
import { Key } from '@tamagui/lucide-icons'
import { ChatPage } from '@src/features/openai'

export default function ChatTabScreen() {
  const [apiKey, setApiKey] = useState('')
  const [isApiKeySet, setIsApiKeySet] = useState(false)

  const handleSetApiKey = () => {
    if (apiKey.trim()) {
      setIsApiKeySet(true)
    }
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

  return <ChatPage apiKey={apiKey} />
}