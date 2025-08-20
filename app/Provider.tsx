import { useColorScheme, SafeAreaView } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { TamaguiProvider, type TamaguiProviderProps } from '@my/ui'
import { ToastProvider, ToastViewport } from '@tamagui/toast'
import { CurrentToast } from './CurrentToast'
import { config } from '@my/ui'
import { AuthProvider } from '@src/features/auth/useAuth'



export function Provider({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>) {

  const colorScheme = useColorScheme()

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <TamaguiProvider
          config={config}
          defaultTheme={colorScheme === 'dark' ? 'dark_green' : 'light_green'}
          {...rest}
        >
          <ToastProvider
            swipeDirection="horizontal"
            duration={6000}
            native={
              [
                // uncomment the next line to do native toasts on mobile. NOTE: it'll require you making a dev build and won't work with Expo Go
                //'mobile'
              ]
            }
          >

            {children}

            <CurrentToast />
            <ToastViewport top="$8" left={0} right={0} />
          </ToastProvider>
        </TamaguiProvider>
      </AuthProvider>
    </SafeAreaProvider>

  )
}
