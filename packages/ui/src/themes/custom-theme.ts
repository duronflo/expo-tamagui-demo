import { createThemes, defaultComponentThemes } from '@tamagui/theme-builder'
import * as Colors from '@tamagui/colors'

const darkPalette = ['hsla(87, 26%, 5%, 1)', 'hsla(87, 26%, 8%, 1)', 'hsla(87, 26%, 10%, 1)', 'hsla(87, 25%, 13%, 1)', 'hsla(87, 25%, 15%, 1)', 'hsla(85, 27%, 22%, 1)', 'hsla(82, 29%, 29%, 1)', 'hsla(80, 31%, 36%, 1)', 'hsla(77, 33%, 43%, 1)', 'hsla(75, 35%, 50%, 1)', 'hsla(75, 45%, 85%, 1)', 'hsla(75, 55%, 95%, 1)']
const lightPalette = ['hsla(87, 26%, 93%, 1)', 'hsla(87, 26%, 91%, 1)', 'hsla(87, 26%, 89%, 1)', 'hsla(87, 25%, 87%, 1)', 'hsla(87, 25%, 85%, 1)', 'hsla(85, 27%, 78%, 1)', 'hsla(82, 29%, 71%, 1)', 'hsla(80, 31%, 64%, 1)', 'hsla(77, 33%, 57%, 1)', 'hsla(75, 35%, 50%, 1)', 'hsla(75, 45%, 25%, 1)', 'hsla(75, 55%, 10%, 1)']

const lightShadows = {
    shadow1: 'rgba(0,0,0,0.04)',
    shadow2: 'rgba(0,0,0,0.08)',
    shadow3: 'rgba(0,0,0,0.16)',
    shadow4: 'rgba(0,0,0,0.24)',
    shadow5: 'rgba(0,0,0,0.32)',
    shadow6: 'rgba(0,0,0,0.4)',
}

const darkShadows = {
    shadow1: 'rgba(0,0,0,0.2)',
    shadow2: 'rgba(0,0,0,0.3)',
    shadow3: 'rgba(0,0,0,0.4)',
    shadow4: 'rgba(0,0,0,0.5)',
    shadow5: 'rgba(0,0,0,0.6)',
    shadow6: 'rgba(0,0,0,0.7)',
}

// we're adding some example sub-themes for you to show how they are done, "success" "warning", "error":

const builtThemes = createThemes({
    componentThemes: defaultComponentThemes,

    base: {
        palette: {
            dark: darkPalette,
            light: lightPalette,
        },

        extra: {
            light: {
                ...Colors.green,
                ...Colors.red,
                ...Colors.yellow,
                ...lightShadows,
                shadowColor: lightShadows.shadow1,
            },
            dark: {
                ...Colors.greenDark,
                ...Colors.redDark,
                ...Colors.yellowDark,
                ...darkShadows,
                shadowColor: darkShadows.shadow1,
            },
        },
    },

    accent: {
        palette: {
            dark: ['hsla(31, 62%, 15%, 1)', 'hsla(31, 63%, 18%, 1)', 'hsla(31, 64%, 20%, 1)', 'hsla(31, 64%, 23%, 1)', 'hsla(31, 65%, 25%, 1)', 'hsla(31, 66%, 30%, 1)', 'hsla(31, 67%, 35%, 1)', 'hsla(30, 68%, 40%, 1)', 'hsla(30, 69%, 45%, 1)', 'hsla(30, 70%, 50%, 1)', 'hsla(30, 75%, 80%, 1)', 'hsla(30, 80%, 95%, 1)'],
            light: ['hsla(31, 62%, 83%, 1)', 'hsla(31, 63%, 81%, 1)', 'hsla(31, 64%, 79%, 1)', 'hsla(31, 64%, 77%, 1)', 'hsla(31, 65%, 75%, 1)', 'hsla(31, 66%, 70%, 1)', 'hsla(31, 67%, 65%, 1)', 'hsla(30, 68%, 60%, 1)', 'hsla(30, 69%, 55%, 1)', 'hsla(30, 70%, 50%, 1)', 'hsla(30, 75%, 30%, 1)', 'hsla(30, 80%, 15%, 1)'],
        },
    },

    childrenThemes: {
        warning: {
            palette: {
                dark: Object.values(Colors.yellowDark),
                light: Object.values(Colors.yellow),
            },
        },

        error: {
            palette: {
                dark: Object.values(Colors.redDark),
                light: Object.values(Colors.red),
            },
        },

        success: {
            palette: {
                dark: Object.values(Colors.greenDark),
                light: Object.values(Colors.green),
            },
        },
    },

    // optionally add more, can pass palette or template

    // grandChildrenThemes: {
    //   alt1: {
    //     template: 'alt1',
    //   },
    //   alt2: {
    //     template: 'alt2',
    //   },
    //   surface1: {
    //     template: 'surface1',
    //   },
    //   surface2: {
    //     template: 'surface2',
    //   },
    //   surface3: {
    //     template: 'surface3',
    //   },
    // },
})

export type Themes = typeof builtThemes

// the process.env conditional here is optional but saves web client-side bundle
// size by leaving out themes JS. tamagui automatically hydrates themes from CSS
// back into JS for you, and the bundler plugins set TAMAGUI_ENVIRONMENT. so
// long as you are using the Vite, Next, Webpack plugins this should just work,
// but if not you can just export builtThemes directly as themes:
export const themes: Themes =
    process.env.TAMAGUI_ENVIRONMENT === 'client' &&
        process.env.NODE_ENV === 'production'
        ? ({} as any)
        : (builtThemes as any)
