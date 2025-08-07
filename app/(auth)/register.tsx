import { Camera, Check, Eye, EyeOff } from '@tamagui/lucide-icons'
import { useId, useState } from 'react'
import {
  AnimatePresence,
  Button,
  Checkbox,
  H3,
  Label,
  SizableText,
  Spinner,
  Stack,
  Switch,
  Theme,
  View,
  useEvent,
  useTheme,
} from 'tamagui'
import { Input } from '@/components/ui/forms/inputs/components/inputsParts'
import { FormCard } from '@/components/ui/forms/layouts/components/layoutParts'
import { isWeb } from 'tamagui'
import { SafeAreaView } from 'react-native'
import { useAuth } from '@/features/auth/useAuth'


export default function RegisterScreen() {

  const theme = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.val }}>
      <View padding="$4" bg="$background">
        <SignUpScreen />
      </View>
    </SafeAreaView>
  )
}


/** ------ EXAMPLE ------ */
export function SignUpScreen() {
  const uniqueId = useId()
  const { signIn, status } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [receiveNotification, setReceiveNotification] = useState(false)
  return (
      <View
        flexDirection="column"
        alignItems="stretch"
        maxWidth="100%"
        width={450}
        gap="$4"
        $group-window-xs={{
          gap: '$3',
          paddingVertical: '$6',
          paddingHorizontal: '$5',
        }}
        $xs={{ paddingVertical: '$4' }}
      >
        <H3>
          Register
        </H3>
        <Theme name={"gray"}>
          <View flexDirection="row" flexWrap="wrap" width="100%" gap="$4">
            <View
              flexDirection="column"
              flex={1}
              gap="$1"
              minWidth="100%"
              $group-window-gtXs={{ minWidth: 'inherit' }}
            >

              <Input size="$4">
                <Input.Label htmlFor={uniqueId + 'first-name'}>First Name</Input.Label>
                <Input.Box minWidth="100%">
                  <Input.Area id={uniqueId + 'first-name'} placeholder="First name" />
                </Input.Box>
              </Input>
            </View>
            <View flexDirection="column" flex={1} gap="$1">
              <Input size="$4">
                <Input.Label htmlFor={uniqueId + 'last-name'}>Last Name</Input.Label>
                <Input.Box>
                  <Input.Area id={uniqueId + 'last-name'} placeholder="Last name" />
                </Input.Box>
              </Input>
            </View>
          </View>
          <Input size="$4">
            <Input.Label htmlFor={uniqueId + 'password'}>Password</Input.Label>
            <Input.Box>
              <Input.Area
                id={uniqueId + 'password'}
                secureTextEntry={!showPassword}
                placeholder="Password"
              />
              <Input.Icon cursor="pointer" onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <Eye color="$gray11" /> : <EyeOff color="$gray11" />}
              </Input.Icon>
            </Input.Box>
          </Input>
          <Input size="$4">
            <Input.Label htmlFor={uniqueId + 'repeat-password'}>
              Repeat the password
            </Input.Label>
            <Input.Box>
              <Input.Area
                secureTextEntry
                id={uniqueId + 'repeat-password'}
                placeholder="Repeat password"
              />
            </Input.Box>
          </Input>
        </Theme>

        <Theme name={"orange"}>
          <Button
            disabled={status === 'loading'}
            onPress={signIn}
            cursor={status === 'loading' ? 'progress' : 'pointer'}
            alignSelf="flex-end"
            minWidth="100%"
            $gtSm={{
              maxWidth: '$12',
              minWidth: '$12',
            }}
            iconAfter={
              <AnimatePresence>
                {status === 'loading' && (
                  <Spinner
                    size="small"
                    color="$color"
                    key="loading-spinner"
                    opacity={1}
                    position="absolute"
                    scale={0.5}
                    left={110}
                    animation="quick"
                    enterStyle={{
                      opacity: 0,
                      scale: 0.5,
                    }}
                    exitStyle={{
                      opacity: 0,
                      scale: 0.5,
                    }}
                  />
                )}
              </AnimatePresence>
            }
          >
            Sign Up
          </Button>
          {!isWeb && <SafeAreaView />}
        </Theme>
      </View>
  )
}

SignUpScreen.fileName = 'SignUpScreen'

export function VerticalCheckboxes() {
  const [values, setValues] = useState([
    {
      id: 'hor-developer',
      label: 'Developer',
      checked: false,
    },
    {
      id: 'hor-designer',
      label: 'Designer',
      checked: false,
    },
  ])
  const toggleValue = (value: string) => {
    setValues((prev) =>
      prev.map((item) => ({
        ...item,
        checked: item.id === value ? !item.checked : item.checked,
      }))
    )
  }
  return (
    <View flexDirection="column" gap="$1">
      <Input.Label htmlFor={'customize-content'}>Customize content</Input.Label>
      <View flexDirection="column" gap="$1">
        <SizableText size="$4" fontWeight="300" col="$gray10">
          Select type of user:
        </SizableText>
        <View flexDirection="column">
          {values.map(({ id, label, checked }) => (
            <Item
              key={label}
              id={id}
              toggleValue={toggleValue}
              label={label}
              checked={checked}
            />
          ))}
        </View>
      </View>
    </View>
  )
}

function Item({
  id,
  toggleValue,
  label,
  checked,
}: {
  id: string
  toggleValue: (value: string) => void
  label: string
  checked: boolean
}) {
  const onCheckedChange = useEvent(() => toggleValue(id))
  return (
    <View flexDirection="row" width={150} alignItems="center" gap="$3">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange}>
        <Checkbox.Indicator>
          <Check />
        </Checkbox.Indicator>
      </Checkbox>

      <Label size="$3" htmlFor={id}>
        {label}
      </Label>
    </View>
  )
}
