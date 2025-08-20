import { Button, H3, H1, H2, H4, Text, ScrollView, Theme, View, Paragraph, useTheme } from '@my/ui';
import { SafeAreaView, Appearance } from 'react-native'
import { useColorScheme } from 'react-native'
//import { ButtonsWithLeftIcons, ButtonsWithLoaders, RoundedButtons } from '@my/ui';
import { Chips } from '@my/ui';

const ChipsWithIcon = Chips.ChipsWithIcon;

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.val }} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView>
        <View flex={1} jc="center" ai="center">
          <H1 textTransform='uppercase'>Tab Two</H1>
          <Theme name="brown">
            <Button onPress={() => Appearance.setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}> Toggle Darkmode</Button>
          </Theme>

          <Theme name={colorScheme === 'dark' ? 'dark' : 'light'}>
            <ChipsWithIcon />
          </Theme>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}


