import { Button, H1, H2, H3, H4, H5, YStack, Separator, ScrollView, Theme, Paragraph } from '@my/ui'
import { Appearance } from 'react-native'
import { useColorScheme } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function TabThreeScreen() {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['bottom', 'left', 'right']}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <YStack flex={1} jc="center" ai="center" gap="$4" bg="$background">
          <H1 textTransform='uppercase'>Fonts</H1>
          <Theme name="brown">
            <Button onPress={() => Appearance.setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}> Toggle Darkmode</Button>
          </Theme>
          <Separator marginVertical={15} />
          <Paragraph fontFamily="$body">
            This is the second tab of your app. (Lexend)
          </Paragraph>
          <Paragraph fontFamily="$inter">
            This is the second tab of your app. (Inter)
          </Paragraph>
          <Separator marginVertical={15} />
          <Paragraph fontFamily="$body" fontWeight="800">
            This is the second tab of your app. (Lexend)
          </Paragraph>
          <Paragraph fontFamily="$body" fontWeight="700">
            This is the second tab of your app. (Lexend)
          </Paragraph>
          <Paragraph fontFamily="$body" fontWeight="600">
            This is the second tab of your app. (Lexend)
          </Paragraph>
          <Paragraph fontFamily="$body" fontWeight="500">
            This is the second tab of your app. (Lexend)
          </Paragraph>
          <Paragraph fontFamily="$body" fontWeight="400">
            This is the second tab of your app. (Lexend)
          </Paragraph>
          <Paragraph fontFamily="$body" fontWeight="300">
            This is the second tab of your app. (Lexend)
          </Paragraph>
          <Paragraph fontFamily="$body" fontWeight="200">
            This is the second tab of your app. (Lexend)
          </Paragraph>
          <Paragraph fontFamily="$body" fontWeight="100">
            This is the second tab of your app. (Lexend)
          </Paragraph>
          <Separator marginVertical={15} />
          <Paragraph fontFamily="$inter" fontWeight="800">
            This is the second tab of your app. (Inter)
          </Paragraph>
          <Paragraph fontFamily="$inter" fontWeight="700">
            This is the second tab of your app. (Inter)
          </Paragraph>
          <Paragraph fontFamily="$inter" fontWeight="600">
            This is the second tab of your app. (Inter)
          </Paragraph>
          <Paragraph fontFamily="$inter" fontWeight="500">
            This is the second tab of your app. (Inter)
          </Paragraph>
          <Paragraph fontFamily="$inter" fontWeight="400">
            This is the second tab of your app. (Inter)
          </Paragraph>
          <Paragraph fontFamily="$inter" fontWeight="300">
            This is the second tab of your app. (Inter)
          </Paragraph>
          <Paragraph fontFamily="$inter" fontWeight="200">
            This is the second tab of your app. (Inter)
          </Paragraph>
          <Paragraph fontFamily="$inter" fontWeight="100">
            This is the second tab of your app. (Inter)
          </Paragraph>
          <Separator marginVertical={15} />
          <H1>Heading</H1>
          <H2>Heading</H2>
          <H3>Heading</H3>
          <H4>Heading</H4>
          <H5>Heading</H5>

        </YStack>
      </ScrollView>
    </SafeAreaView>
  )
}
