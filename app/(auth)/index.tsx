import { OnboardingScreen } from '@src/features/auth/onboarding'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
      <OnboardingScreen />
    </SafeAreaView>
  )
}
