import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Pressable,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthenticationScreen from "./screens/AuthenticationScreen.js";
import LoginScreen from "./screens/Login.js";
import SignupScreen from "./screens/Signup.js";
import Homepage from "./screens/Homepage.js";
import { Provider } from "react-redux";
import { Store } from "./redux/store.js";
import Quests from "./screens/Quests.js";
import Settings from "./screens/Settings";
import Shop from "./screens/Shop";
import Organisations from "./screens/Organisations";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth" component={AuthenticationScreen} />
          <Stack.Screen name="login" component={LoginScreen} />
          <Stack.Screen name="signup" component={SignupScreen} />
          <Stack.Screen name="homepage" component={Homepage} />
          <Stack.Screen name="quests" component={Quests} />
          <Stack.Screen name="settings" component={Settings} />
          <Stack.Screen name="shop" component={Shop} />
          <Stack.Screen name="organisations" component={Organisations} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({});
