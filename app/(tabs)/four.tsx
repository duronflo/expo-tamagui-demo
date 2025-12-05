import { Button, ScrollView, Theme, YStack, useTheme } from '@my/ui'
import { Appearance } from 'react-native'
import { useColorScheme } from 'react-native'
import { Meeting } from '@my/ui'
import { SafeAreaView } from 'react-native-safe-area-context'



export default function TabFourScreen() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['bottom', 'left', 'right']}>
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
      <YStack flex={1} m="$4" jc="center" ai="center" gap="$4" bg="$background">
        <Theme name="brown">
          <Button onPress={() => Appearance.setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}> Toggle Darkmode</Button>
        </Theme>


        <Theme name="gray">
          <Meeting />
        </Theme>
      </YStack>
    </ScrollView>
    </SafeAreaView>
  )
}
