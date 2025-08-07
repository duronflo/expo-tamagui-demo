

import { Link } from 'expo-router'
import {
  Anchor,
  AnimatePresence,
  Button,
  H1,
  Paragraph,
  Separator,
  SizableText,
  Spinner,
  Theme,
  Text,
  View,
  XStack,
  YStack,
} from 'tamagui'
import { Input } from '@/components/ui/forms/inputs/components/inputsParts'
import { SafeAreaView } from 'react-native'

import { useAuth } from '@/features/auth/useAuth'


export default function LoginScreen() {
  return (
      <View flex={1} padding="$4" bg="$background">
        <SignInScreen />
      </View>

  )
}

function MyMonjiHeader() {
  return (
    <XStack jc="center" ai="center" >
      <H1 color="$purple10">M</H1>
      <H1 color="$green10">Y</H1>
      <H1> </H1>
      <H1 color="$blue10">A</H1>
      <H1 color="$orange10">P</H1>
      <H1 color="$pink10">P</H1>
      <H1 color="$brown10">P</H1>
      <H1 color="$gray10">P</H1>
    </XStack>
  )
}



/** ------ EXAMPLE ------ */
export function SignInScreen() {
  const { signIn, status, isLoggedIn} = useAuth()
  return (
    <YStack
      flex={1}
      ai="stretch"
      jc='center'
      gap="$4"
    >

      <MyMonjiHeader />

      <View flexDirection="column" gap="$3">
        <View flexDirection="column" gap="$1">
          <Theme name="gray">
            <Input size="$4" id="email">
              <Input.Label theme="active" htmlFor="email">Email</Input.Label>
              <Input.Box >
                <Input.Area color='$gray10' id="email" placeholder="email@example.com" />
              </Input.Box>
            </Input>
          </Theme>
        </View>
        <View flexDirection="column" gap="$1">
          <Theme name="gray">
            <Input size="$4" id="password">
              <View
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Input.Label htmlFor={'password'}>Password</Input.Label>
              </View>
              <Input.Box>
                <Input.Area
                  textContentType="password"
                  secureTextEntry
                  id={'password'}
                  placeholder="Enter password"
                />
              </Input.Box>

              <ForgotPasswordLink />
            </Input>
          </Theme>
        </View>
      </View>
      <Theme name={"orange"}>
        <Button
          disabled={status === 'loading'}
          onPress={signIn}
          width="100%"
          iconAfter={
            <AnimatePresence>
              {status === 'loading' && (
                <Spinner
                  color="$color"
                  key="loading-spinner"
                  opacity={1}
                  scale={1}
                  animation="quick"
                  position="absolute"
                  left="70%"
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
          <Button.Text>Sign In</Button.Text>
        </Button>
      </Theme>
      <View flexDirection="column" gap="$3" width="100%" alignItems="center">
        <Theme>
          <View
            flexDirection="column"
            gap="$3"
            width="100%"
            alignSelf="center"
            alignItems="center"
          >
            <View flexDirection="row" width="100%" alignItems="center" gap="$4">
              <Separator />
              <Paragraph>Or</Paragraph>
              <Separator />
            </View>
            {/*               <View flexDirection="row" flexWrap="wrap" gap="$3">
                <Button flex={1} minWidth="100%">
                  <Button.Icon>
                    <Github color="$gray10" size="$1" />
                  </Button.Icon>
                  <Button.Text>Continue with Github</Button.Text>
                </Button>
                <Button flex={1}>
                  <Button.Icon>
                    <Facebook color="$blue10" size="$1" />
                  </Button.Icon>
                  <Button.Text>Continue with Facebook</Button.Text>
                </Button>
              </View> */}
          </View>
        </Theme>
      </View>
      <SignUpLink />
    </YStack>
  )
}

SignInScreen.fileName = 'SignInScreen'

/* // Swap for your own Link
const Link = ({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) => {
  return (
    <View href={href} tag="a">
      {children}
    </View>
  )
} */

const SignUpLink = () => {
  return (
    <Link href={'/register'}>
      <Paragraph textDecorationStyle="unset" ta="center">
        Don&apos;t have an account?{' '}
        <SizableText
          hoverStyle={{
            color: '$colorHover',
          }}
          textDecorationLine="underline"
        >
          Sign up
        </SizableText>
      </Paragraph>
    </Link>
  )
}

const ForgotPasswordLink = () => {
  return (
    <Anchor alignSelf="flex-end" href={'/index'}>
      <Paragraph
        color="$gray10"
        hoverStyle={{
          color: '$gray10',
        }}
        size="$1"
        marginTop="$1"
      >
        Forgot your password?
      </Paragraph>
    </Anchor>
  )
}
