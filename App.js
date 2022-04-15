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
import Quests from "./screens/Quests.js";
import Settings from "./screens/Settings";
import Shop from "./screens/Shop";
import Organisations from "./screens/Organisations";
import { UserContext } from "./UserContext.js";
import { QuestContext } from "./QuestContext.js";
import { useMemo, useState } from "react";
import AddTask from "./screens/AddTask.js";
import QuestPage from "./screens/QuestPage.js";
import QuestActive from "./screens/QuestActive.js";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [quest, setQuest] = useState(null);

  const providerValue = useMemo(() => ({ user, setUser }), [user, setUser]);
  const questProviderValue = useMemo(
    () => ({ quest, setQuest }),
    [quest, setQuest]
  );
  const rewardData = {
    easy: {
      coins: 5,
      xp: 10,
    },
    medium: {
      coins: 10,
      xp: 20,
    },
    hard: {
      coins: 20,
      xp: 40,
    },
  };

  return (
    <UserContext.Provider value={providerValue}>
      <QuestContext.Provider value={questProviderValue}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="auth" component={AuthenticationScreen} />
            <Stack.Screen name="login" component={LoginScreen} />
            <Stack.Screen name="signup" component={SignupScreen} />
            <Stack.Screen name="homepage" component={Homepage} />
            <Stack.Screen name="addtask" component={AddTask} />
            <Stack.Screen name="quests" component={Quests} />
            <Stack.Screen
              name="questPage"
              component={QuestPage}
              initialParams={rewardData}
            />
            <Stack.Screen
              name="activeQuestPage"
              component={QuestActive}
              initialParams={rewardData}
            />
            <Stack.Screen name="settings" component={Settings} />
            <Stack.Screen name="shop" component={Shop} />
            <Stack.Screen name="organisations" component={Organisations} />
          </Stack.Navigator>
        </NavigationContainer>
      </QuestContext.Provider>
    </UserContext.Provider>
  );
}

const styles = StyleSheet.create({});
