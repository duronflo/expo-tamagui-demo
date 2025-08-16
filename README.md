note because this is in a monorepo had to remove react, react-dom, and react-native-web deps and change metro.config.js a bit.

## change to package.json

this part (see below) has to be included in package.json. It forces yarn/npm to pull no higher version than this to prevent metro build breaks during first start. The version of metro's has been derived with npx expo-doctor. It might have been updated with an update of expo sdk.

```
  "resolutions": {
    "metro": "^0.82.0",
    "metro-config": "^0.82.0",
    "metro-resolver": "^0.82.0"
  },
```