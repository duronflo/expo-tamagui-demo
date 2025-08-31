import { ScrollView } from '@my/ui'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SettingsScreen } from '@src/features/settings/screen'


export default function TabFiveScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
      <ScrollView style={{ flex: 1 }}>
        <SettingsScreen />
      </ScrollView>
    </SafeAreaView>
  )
}
