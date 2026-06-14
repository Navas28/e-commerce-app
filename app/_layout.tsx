import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, LeagueSpartan_400Regular } from '@expo-google-fonts/league-spartan';
import * as SplashScreen from 'expo-splash-screen';
import { store, persistor } from '../redux/store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ LeagueSpartan_400Regular });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
          <Tabs.Screen name="index" />
          <Tabs.Screen name="bag" />
          <Tabs.Screen name="product/[id]" />
          <Tabs.Screen name="favourites" />
        </Tabs>
      </PersistGate>
    </Provider>
    </SafeAreaProvider>
  );
}
