import { StyleSheet, Text, View, ImageBackground, Alert } from "react-native";
import { useContext, useMemo, useState } from "react";
import { QuestContext } from "../QuestContext";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import { setStatusBarHidden, StatusBar } from "expo-status-bar";
import { UserContext } from "../UserContext";
import {doc, updateDoc, getFirestore, deleteDoc} from "firebase/firestore";

const QuestActive = ({ route, navigation }) => {
  const rewardData = route.params;
  const { user, setUser } = useContext(UserContext);
  const db = getFirestore();
  const [] = useFonts({
    RetroGaming: require("../assets/fonts/RetroGaming-Regular.ttf"),
    InkyThinPixels: require("../assets/fonts/InkyThinPixels-Regular.ttf"),
    PlayMeGames: require("../assets/fonts/Playmegames-Regular.ttf"),
  });

  const [isGameOver, setIsGameOver] = useState(false);

  const potentialBackgrounds = [
    require("../assets/backgrounds/activeTaskBackgrounds/activePage1.png"),
    require("../assets/backgrounds/activeTaskBackgrounds/activePage2.png"),
    require("../assets/backgrounds/activeTaskBackgrounds/activePage3.png"),
  ];
  const background = useMemo(
    () =>
      potentialBackgrounds[
        Math.floor(Math.random() * potentialBackgrounds.length)
      ],
    []
  );

  const { quest, setQuest } = useContext(QuestContext);
  const [time, setTime] = useState(quest["duration"]);
  const [loaded] = useFonts({
    RetroGaming: require("../assets/fonts/RetroGaming-Regular.ttf"),
  });

  useEffect(() => {
    // const timeout = setTimeout(() => {
    //   setTime(time - 1);
    // }, 1000);
    setInterval(() => {
        setTime((time) => time - 1);
    }, 1000);
    // return () => {
    //   // alert("DONE!");
    //   clearTimeout(timeout);
    // };
  }, []);

  useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      if (!isGameOver) {
        Alert.alert("You cannot leave until the quest is complete!", "", [{ text: "OK" , onPress: () => {}}]);
      }
      else if(isGameOver)
      {
        navigation.dispatch(e.data.action);
      }
    });
  }, [navigation, isGameOver]);

  useEffect(() => {
    console.log(time);
    if (time === 0) {
      console.log("time is up");
      Alert.alert("Quest Completed?", "Have you completed the quest?", [
        {
          text: "Yes",
          onPress: () => {
            Alert.alert("Quest completed! You will now receive the rewards.");
            setIsGameOver(true);
            const tasks = user.tasks;
            tasks.splice(tasks.indexOf(quest.title), 1);
            setUser({
              coins: user.coins + rewardData[quest.difficulty].coins,
              currentXp:
                  user.currentXp + rewardData[quest.difficulty].xp,
              diamonds: user.diamonds,
              displayName: user.displayName,
              email: user.email,
              level: user.level,
              multiplier: user.multiplier,
              questsDone: user.questsDone + 1,
              avatar: user.avatar,
              activeQuest: user.activeQuest,
              emotes: user.emotes,
              items: user.items,
              tasks: user.tasks,
            });
            console.log("user context updated");
            navigation.navigate("homepage");
            updateDoc(doc(db, "users", user.email), {
              coins: user.coins + rewardData[quest.difficulty].coins,
              currentXp:
                  user.currentXp + rewardData[quest.difficulty].xp,
              tasks: user.tasks,
            }).then(() => {
              console.log("updateDoc for quest rewards");
              deleteDoc(doc(db, "tasks", quest.title));
            }).then(() => {
              console.log("deleteDoc for quest");
            });
          },
        },
        {
          text: "No",
          onPress: () => {
            Alert.alert("You won't be getting the rewards. Good try.");
            setIsGameOver(true);
            navigation.navigate("homepage");
          },
        },
      ]);
      setStatusBarHidden(false);
    }
  }, [time]);



  return (
    <View>
      <ImageBackground
        style={styles.bg}
        source={background}
        onLayout={async () => {
          await NavigationBar.setVisibilityAsync("hidden");
          await setStatusBarHidden(true);
        }}
      >
        <Text style={styles.disclaimerText}>PUT THE PHONE DOWN!</Text>
        <Text style={styles.timerText}>
          {Math.floor(time / 60) + ":" + Math.round(time % 60)}
        </Text>
      </ImageBackground>
    </View>
  );
};

export default QuestActive;

const styles = StyleSheet.create({
  bg: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  disclaimerText: {
    marginTop: 50,
    fontSize: 50,
    textAlign: "center",
    width: "100%",
    color: "white",
    fontFamily: "PlayMeGames",

    // if i is even then it should be to the right else to the left
  },
  timerText: {
    marginTop: 350,
    fontSize: 45,
    textAlign: "center",
    width: "100%",
    color: "white",
    fontFamily: "PlayMeGames",
  },
});
