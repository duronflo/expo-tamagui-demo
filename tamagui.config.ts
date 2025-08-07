import { defaultConfig } from '@tamagui/config/v4'
import { createTokens, createTamagui, setupDev } from 'tamagui'
import { shorthands } from '@tamagui/shorthands'

import { themes as customThemes } from '@/themes/custom-theme'
import { themes as themesIn  } from '@/themes/theme'
import { color } from '@/themes/token-colors'
import { radius } from '@/themes/token-radius'
import { size } from '@/themes/token-size'
import { space } from '@/themes/token-space'
import { zIndex } from '@/themes/token-z-index'
import { animations } from '@/config/animations'
import { bodyFont, headingFont, interFont } from '@/config/fonts'


// Hold down Option for a second to see some helpful visuals
setupDev({
  visualizer: true,
})

const themes = themesIn;

export const config = createTamagui({
  ...defaultConfig,
  themes,
  defaultFont: 'body',
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  selectionStyles: (theme) => ({
    backgroundColor: theme.color5,
    color: theme.color11,
  }),
  onlyAllowShorthands: false,
  shorthands,
  fonts: {
    heading: headingFont,
    body: bodyFont,
    inter: interFont
  },
  tokens: createTokens({
    color,
    radius,
    zIndex,
    space,
    size,
  }),
  settings: {
    allowedStyleValues: 'somewhat-strict',
    autocompleteSpecificTokens: 'except-special',
    fastSchemeChange: true,
  },
})

//console.log(Object.keys(customThemes))

export default config


export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}


