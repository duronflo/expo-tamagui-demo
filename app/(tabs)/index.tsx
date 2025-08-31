import { ExternalLink } from '@tamagui/lucide-icons'
import { Anchor, H2, Paragraph, XStack, YStack } from '@my/ui'
import { ToastControl } from '../CurrentToast'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function TabOneScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
      <YStack flex={1} ai="center" jc="center" gap="$8" px="$10" pt="$5" bg="$background">
        <H2>Tamagui + Expo</H2>

        <ToastControl />

        <XStack
          ai="center"
          jc="center"
          flexWrap="wrap"
          gap="$1.5"
          position="absolute"
          b="$8"
        >
          <Paragraph fontSize="$5">Add</Paragraph>

          <Paragraph fontSize="$5" px="$2" py="$1" color="$blue10" bg="$blue5">
            tamagui.config.ts
          </Paragraph>

          <Paragraph fontSize="$5">to root and follow the</Paragraph>

          <XStack
            ai="center"
            gap="$1.5"
            px="$2"
            py="$1"
            bg="$green5"
            hoverStyle={{ bg: '$green6' }}
            pressStyle={{ bg: '$green4' }}
          >
            <Anchor
              href="https://tamagui.dev/docs/core/configuration"
              textDecorationLine="none"
              color="$green10"
              fontSize="$5"
            >
              Configuration guide
            </Anchor>
            <ExternalLink size="$1" color="$green10" />
          </XStack>

          <Paragraph fontSize="$5" jc="center">
            to configure your themes and tokens.
          </Paragraph>
        </XStack>
      </YStack>
    </SafeAreaView>
  )
}
