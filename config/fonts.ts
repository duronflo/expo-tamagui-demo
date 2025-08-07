import { createSilkscreenFont } from '@tamagui/font-silkscreen'
import { createInterFont } from '@tamagui/font-inter'
import { createFont } from '@tamagui/core'
import { createLexendFont } from '@/assets/fonts/font-lexend/src'

export const headingFont = createSilkscreenFont(
  {
    family: 'Silkscreen',
    transform: {
      6: 'none',
      7: 'none',
    },
    weight: {
      3: '500',
      4: '700',
    },
    face: {
      700: { normal: 'Silkscreen' },
    },
  },
)

export const interFont = createInterFont(
  {
    face: {
      700: { normal: 'InterBold' },
    },
  },
  {
    sizeSize: (size) => Math.round(size * 1.1),
    sizeLineHeight: (size) => size + 5,
  }
) 


export const bodyFont = createLexendFont(
  {
    family: 'Lexend',
    size: {
      6: 18,
    },
    transform: {
      6: 'none',
      7: 'none',
    },
    weight: {
      4: '300',
    },
    face: {
      100: { normal: 'LexendThin' },
      200: { normal: 'LexendLight' },
      300: { normal: 'Lexend' },
      500: { normal: 'LexendMedium' },
      600: { normal: 'LexendSemiBold' },
      700: { normal: 'LexendBold' },
      800: { normal: 'LexendExtraBold' }, // Lexend doesn't have an 800 weight, so we use Bold
    },
  },
  {
    sizeSize: (size) => Math.round(size * 1.1),
    sizeLineHeight: (size) => size + 5,
  }
)