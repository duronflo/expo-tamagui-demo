import { Text, View } from 'tamagui'
import { SignInScreen } from '@/components/ui/forms/layouts'
import { SafeAreaView } from 'react-native'


export default function LoginScreen() {
  return (
    <SafeAreaView>
      <View margin="$4" padding="$4">
        <SignInScreen />
      </View>
    </SafeAreaView>
  )
}
