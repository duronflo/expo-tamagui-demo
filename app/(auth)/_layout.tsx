import { Link, Stack, Tabs } from 'expo-router'
import { Button, useTheme } from 'tamagui'
import { Atom, AudioWaveform } from '@tamagui/lucide-icons'

export default function AuthLayout() {
  const theme = useTheme()

  return (
    <Stack
      screenOptions={{
        
        headerStyle: {
          backgroundColor: theme.background.val,
        },
        headerTintColor: theme.color.val,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Login', headerShown: false }} />
      <Stack.Screen name="register" options={{ title: 'Register', headerTitle: '', headerBackTitle: 'Back' }} />
    </Stack>
  )
}
