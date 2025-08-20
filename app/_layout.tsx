import '../tamagui-web.css'

import { useEffect } from 'react'
import { SafeAreaView, useColorScheme } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { Provider } from './Provider'
import { useTheme } from '@my/ui'
import { useAuth } from '@src/features/auth/useAuth';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    Silkscreen: require('@/assets/fonts/Silkscreen-Regular.ttf'),
    SilkscreenBold: require('@/assets/fonts/Silkscreen-Bold.ttf'),
    LexendLight: require('@/assets/fonts/font-lexend/fonts/static/Lexend-Light.ttf'),
    LexendThin: require('@/assets/fonts/font-lexend/fonts/static/Lexend-Thin.ttf'),
    Lexend: require('@/assets/fonts/font-lexend/fonts/static/Lexend-Regular.ttf'),
    LexendMedium: require('@/assets/fonts/font-lexend/fonts/static/Lexend-Medium.ttf'),
    LexendSemiBold: require('@/assets/fonts/font-lexend/fonts/static/Lexend-SemiBold.ttf'),
    LexendBold: require('@/assets/fonts/font-lexend/fonts/static/Lexend-Bold.ttf'),
    LexendExtraBold: require('@/assets/fonts/font-lexend/fonts/static/Lexend-ExtraBold.ttf'),
  })



  useEffect(() => {
    if (fontsLoaded || fontsError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontsError])

  if (!fontsLoaded && !fontsError) {
    return null
  }

  return (
    <Providers>
      <RootLayoutNav />
    </Providers>
  )
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (

      <Provider>{children}</Provider>

  )
}

function RootLayoutNav() {


  const colorScheme = useColorScheme();
  const theme = useTheme();
  const { isLoggedIn } = useAuth();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <Stack>
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="modal"
            options={{
              title: 'Tamagui + Expo',
              presentation: 'modal',
              animation: 'slide_from_right',
              gestureEnabled: true,
              gestureDirection: 'horizontal',
              headerStyle: {
                backgroundColor: theme.background.val,
              },
              contentStyle: {
                backgroundColor: theme.background.val,
              },
            }}
          />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  )
}
