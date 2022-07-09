import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import React from "react";
import Topbar from "../components/Topbar";
import BottomBar from "../components/BottomBar";
import { useContext, useEffect, useState } from "react/cjs/react.development";
import { UserContext } from "../UserContext";
import { QuestContext } from "../QuestContext";
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { db } from "../firebase";
import { Audio } from "expo-av";
import { useFonts } from "expo-font";

const PickATask = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext);
  const { quest, setQuest } = useContext(QuestContext);
  const [sound, setSound] = useState();
  const [] = useFonts({
    RetroGaming: require("../assets/fonts/RetroGaming-Regular.ttf"),
    InkyThinPixels: require("../assets/fonts/InkyThinPixels-Regular.ttf"),
    PlayMeGames: require("../assets/fonts/Playmegames-Regular.ttf"),
  });

  async function playSelect() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sfx/tap2.mp3")
    );
    setSound(sound);
    await sound.playAsync();
  }

  const pressHandler = async (taskTitle) => {
    await playSelect();
    const docSnap = await getDoc(doc(db, "tasks", taskTitle));
    await setQuest(docSnap.data());
    await navigation.navigate("matchmakingSelect");
  };

  return (
    <View>
      <ImageBackground
        source={require("../assets/background.png")}
        style={styles.bg}
      >
        <Topbar />
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Pick a quest to complete</Text>
        </View>
        <ScrollView style={styles.tasksContainer}>
          {user["tasks"].map((task, index) => {
            return (
              <Pressable
                style={styles.taskContainer}
                key={index}
                onPress={() => pressHandler(task)}
                android_disableSound={true}
              >
                <Text style={styles.tasksText}>{task}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <BottomBar />
      </ImageBackground>
    </View>
  );
};

export default PickATask;

const styles = StyleSheet.create({
  bg: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    display: "flex",
    alignItems: "center",
  },
  banner: {
    marginTop: 50,
    backgroundColor: "#DD4141",
    width: "100%",
  },
  bannerText: {
    fontSize: 40,
    fontFamily: "PlayMeGames",
    color: "white",
    textAlign: "center",
  },
  tasksText: {
    fontSize: 20,
    fontFamily: "PlayMeGames",
    color: "white",
    textAlign: "center",
  },
  tasksContainer: {
    display: "flex",
    backgroundColor: "#04151F",
    width: 300,
    height: 200,
    marginTop: 25,
  },
  taskContainer: {
    backgroundColor: "#072536",
    width: 300,
    height: "auto",
    marginBottom: 5,
  },
});
