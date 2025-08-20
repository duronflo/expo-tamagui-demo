import { Link, Tabs } from 'expo-router'
import { Button, useTheme } from '@my/ui'
import { Atom, AudioWaveform, LetterText, Command, Clapperboard, Wrench} from '@tamagui/lucide-icons'
import { Platform } from 'react-native'

export default function TabLayout() {
  const theme = useTheme()

  return (
    <Tabs
    
      screenOptions={{
        headerTitleStyle: {
          color: theme.color.val,
          fontFamily: 'Silkscreen',
        },
        tabBarActiveTintColor: theme.accentColor.val,
        tabBarStyle: {
          backgroundColor: theme.background.val,
          borderTopColor: theme.borderColor.val,
        },
        headerStyle: {
          backgroundColor: theme.background.val,
          borderBottomColor: theme.borderColor.val,
        },
        headerTintColor: theme.color.val,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tab One',
          tabBarIcon: ({ color }) => <Atom color={color as any} />,
          headerTitle: '',
          headerShown: true,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Button mr="$4" bg="$green8" color="$green12">
                Hello!
              </Button>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Buttons',
          tabBarIcon: ({ color }) => <Command color={color as any} />,
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: 'Fonts',
          tabBarIcon: ({ color }) => <LetterText color={color as any} />,
        }}
      />
      <Tabs.Screen
        name="four"
        options={{
          title: 'Demo',
          tabBarIcon: ({ color }) => <Clapperboard color={color as any} />,
        }}
      />
      <Tabs.Screen
        name="five"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Wrench color={color as any} />,
        }}
      />
    </Tabs>
  )
}
