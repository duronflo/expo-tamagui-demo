import { Button, H3, H1, H2, H4, Text, Separator, ScrollView, Theme, View, Paragraph, YStack, useTheme } from 'tamagui'
import { SignInScreen } from '@/components/ui/forms/layouts'
import { SafeAreaView, Appearance } from 'react-native'
import { useColorScheme } from 'react-native'
import { useAuth } from '@/features/auth/useAuth'
import { AnimatedNumbers } from '@/components/ui/animation/microinteractions'
import { Meeting, StatusTracker } from '@/components/ui/user/preferences'


export default function TabFourScreen() {
  const { signOut } = useAuth();
  const theme = useTheme();
  const colorScheme = useColorScheme();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background.val }} >
      <YStack flex={1} m="$4" jc="center" ai="center" gap="$4" bg="$background">
        <Theme name="brown">
          <Button onPress={() => Appearance.setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}> Toggle Darkmode</Button>
        </Theme>
        <AnimatedNumbers
          values={[100, 200, 300]}
          duration={1000}
          style={{ fontSize: 24 }}
        />
        <Meeting />
        <Theme name="gray">
          <StatusTracker />
        </Theme>
      </YStack>
    </ScrollView>
  )
}
