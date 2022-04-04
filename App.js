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
	    </Stack.Navigator>
      </NavigationContainer>
  	</Provider>
  );
}

const styles = StyleSheet.create({});
