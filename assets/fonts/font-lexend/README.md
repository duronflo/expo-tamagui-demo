# Prerequisite
First install the dependencies running `yarn install`, then make sure to build the package using `yarn build` and add the package as a dependency to the package/app you want to consume it from (could be the `app` or `ui` package) like so:
```
"dependencies": {
  "@tamagui-google-fonts/lexend": "*"
}
```
## Usage
### Expo
  
Add this to the root of your file:
    
```ts
import { useFonts } from 'expo-font'

export default function App() {
  const [loaded] = useFonts({
    LexendThin: require('@tamagui-google-fonts/lexend/fonts/static/Lexend-Thin.ttf'),
    LexendExtraLight: require('@tamagui-google-fonts/lexend/fonts/static/Lexend-ExtraLight.ttf'),
    LexendLight: require('@tamagui-google-fonts/lexend/fonts/static/Lexend-Light.ttf'),
    Lexend: require('@tamagui-google-fonts/lexend/fonts/static/Lexend-Regular.ttf'),
    LexendMedium: require('@tamagui-google-fonts/lexend/fonts/static/Lexend-Medium.ttf'),
    LexendSemiBold: require('@tamagui-google-fonts/lexend/fonts/static/Lexend-SemiBold.ttf'),
    LexendBold: require('@tamagui-google-fonts/lexend/fonts/static/Lexend-Bold.ttf'),
    LexendExtraBold: require('@tamagui-google-fonts/lexend/fonts/static/Lexend-ExtraBold.ttf'),
    LexendBlack: require('@tamagui-google-fonts/lexend/fonts/static/Lexend-Black.ttf'),
  })
// ...
```

## Web

Get the font's script (`<link>` or `@import`) and add it to `<head>` from [here](https://fonts.google.com/specimen/Lexend)


## Next.js Font (next/font/google)

Import the font from `next/font/google` and give it a variable name in your `_app.tsx` like so:

```ts
import { Lexend } from 'next/font/google' // the casing might differ

const font = Lexend({
  variable: '--my-font',
})
```

Add the variable style in `_app.tsx`:

```tsx
<div className={font.variable}>
  {*/ ...rest of your _app.tsx tree */}
</div>
```

Then go to the generated font package and update `family` with the variable.

So, change it from:
```ts
return createFont({
    family: isWeb
      ? '"Lexend", -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      : 'Lexend',
```

To:
```ts
return createFont({
    family: isWeb
      ? 'var(--my-font), -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      : 'Lexend',
```


## Usage in config

```ts
import { createLexendFont } from '@tamagui-google-fonts/lexend' 

export const myFont = createLexendFont(
  {
    face: {
    "100": {
        "normal": "LexendThin"
    },
    "200": {
        "normal": "LexendExtraLight"
    },
    "300": {
        "normal": "LexendLight"
    },
    "400": {
        "normal": "Lexend"
    },
    "500": {
        "normal": "LexendMedium"
    },
    "600": {
        "normal": "LexendSemiBold"
    },
    "700": {
        "normal": "LexendBold"
    },
    "800": {
        "normal": "LexendExtraBold"
    },
    "900": {
        "normal": "LexendBlack"
    }
}
        },
  {
    // customize the size and line height scaling to your own needs
    // sizeSize: (size) => Math.round(size * 1.1),
    // sizeLineHeight: (size) => size + 5,
  }
)
```

NOTE: these instructions are auto-generated and might not be accurate with some fonts since not all fonts share the same conventions. you may need to edit them out to get them to work.
