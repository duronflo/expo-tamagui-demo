import { Button, H3, H1, H2, H4, Text, ScrollView, Theme, View, Paragraph, useTheme } from '@my/ui';
import { Appearance } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useColorScheme } from 'react-native'
import { Chips, Buttons } from '@my/ui';

const ChipsWithIcon = Chips.ChipsWithIcon;
const ButtonsWithLeftIcons = Buttons.ButtonsWithLeftIcons;
const ButtonsWithLoaders = Buttons.ButtonsWithLoaders;
const RoundedButtons = Buttons.RoundedButtons;

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.val }} edges={['bottom', 'left', 'right']}>
      <ScrollView>
        <View flex={1} jc="center" ai="center">
          <H1 textTransform='uppercase'>Tab Two</H1>
          <Theme name="brown">
            <Button onPress={() => Appearance.setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}> Toggle Darkmode</Button>
          </Theme>

          <Theme name={colorScheme === 'dark' ? 'dark' : 'light'}>
            <ButtonsWithLeftIcons />
            <ButtonsWithLoaders />
            <RoundedButtons />
            <ChipsWithIcon />
          </Theme>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}


