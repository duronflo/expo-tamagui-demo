import { Button, H3, H1, H2, H4, Separator, ScrollView, Theme, Paragraph, YStack } from '@my/ui'
import { Appearance } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useColorScheme } from 'react-native'
import { useAuth } from '@src/features/auth/useAuth'
import { SettingsScreen } from '@src/features/settings/screen'
import { View, Text } from 'react-native'


export default function TabFiveScreen() {
  const { signOut } = useAuth();
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
      <ScrollView>
        <SettingsScreen />
      </ScrollView>
    </SafeAreaView>
  )
}
