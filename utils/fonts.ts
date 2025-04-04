import * as Font from 'expo-font';

export const loadFonts = async () => {
  await Font.loadAsync({
    'PlayfairDisplay-Bold': require('../assets/fonts/PlayfairDisplay-Bold.ttf'),
    'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
};

export const fontFamily = {
  playfairBold: 'PlayfairDisplay-Bold',
  spaceMono: 'SpaceMono-Regular',
};
