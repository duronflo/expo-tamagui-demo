import { Button, H3, H1, H2, H4, Separator, ScrollView, Theme, Paragraph, YStack } from 'tamagui'
import { SignInScreen } from '@/components/ui/forms/layouts'
import { SafeAreaView, Appearance } from 'react-native'
import { useColorScheme } from 'react-native'
import { useAuth } from '@/features/auth/useAuth'
import { View, Text } from 'react-native'
import { LocationNotification } from '@/components/ui/user/preferences'


export default function TabFiveScreen() {
  const { signOut } = useAuth();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <YStack flex={1} jc="center" ai="center" gap="$4" bg="$background">
          <Button m={'$2'} onPress={signOut}>Logout</Button>
          <LocationNotification />
        </YStack>
      </ScrollView>
    </SafeAreaView>
  )
}
