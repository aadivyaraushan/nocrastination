import { StyleSheet } from "react-native";
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
import { OrganisationContext } from "./OrganisationContext.js";
import { useMemo, useState } from "react";
import { GameContext } from "./GameContext.js";
import AddTask from "./screens/AddTask.js";
import QuestPage from "./screens/QuestPage.js";
import QuestActive from "./screens/QuestActive.js";
import Organisation from "./screens/Organisation";
import BattleSelect from "./screens/BattleSelect.js";
import PickATask from "./screens/TaskSelect.js";
import MultiplayerBattle from "./screens/MultiplayerBattle.js";
import MatchmakingSelect from "./screens/MatchmakingSelect.js";
import TaskSelect from "./screens/TaskSelect.js";
import AddGame from "./screens/AddGame.js";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [quest, setQuest] = useState(null);
  const [organisation, setOrganisation] = useState(null);
  const [game, setGame] = useState(null);

  const providerValue = useMemo(() => ({ user, setUser }), [user, setUser]);
  const questProviderValue = useMemo(
    () => ({ quest, setQuest }),
    [quest, setQuest]
  );
  const gameProviderValue = useMemo(() => ({ game, setGame }), [game, setGame]);
  const organisationProviderValue = useMemo(
    () => ({ organisation, setOrganisation }),
    [organisation, setOrganisation]
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
        <OrganisationContext.Provider value={organisationProviderValue}>
          <GameContext.Provider value={gameProviderValue}>
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
                <Stack.Screen name="organisation" component={Organisation} />
                <Stack.Screen name="battleselect" component={BattleSelect} />
                <Stack.Screen name="pickatask" component={PickATask} />
                <Stack.Screen
                  name="multiplayerBattle"
                  component={MultiplayerBattle}
                  initialParams={rewardData}
                />
                <Stack.Screen
                  name="matchmakingSelect"
                  component={MatchmakingSelect}
                />
                <Stack.Screen name="taskSelect" component={TaskSelect} />
                <Stack.Screen name="addGame" component={AddGame} />
              </Stack.Navigator>
            </NavigationContainer>
          </GameContext.Provider>
        </OrganisationContext.Provider>
      </QuestContext.Provider>
    </UserContext.Provider>
  );
}

const styles = StyleSheet.create({});
