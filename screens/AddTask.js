import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import React, { useState, useContext } from "react";
import { getFirestore, setDoc, doc, updateDoc } from "@firebase/firestore";
import { UserContext } from "../UserContext";
import { useFonts } from "expo-font";
import { Audio } from "expo-av";

const AddTask = ({ navigation }) => {
  const [sound, setSound] = useState();
  const [title, setTitle] = useState();
  const [subTasks, setSubTasks] = useState();
  const [difficulty, setDifficulty] = useState();
  const [] = useFonts({
    RetroGaming: require("../assets/fonts/RetroGaming-Regular.ttf"),
    InkyThinPixels: require("../assets/fonts/InkyThinPixels-Regular.ttf"),
    PlayMeGames: require("../assets/fonts/Playmegames-Regular.ttf"),
  });

  const { user, setUser } = useContext(UserContext);
  const db = getFirestore();
  async function playSubmit() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sfx/tap2.mp3")
    );
    setSound(sound);
    await sound.playAsync();
  }
  async function playSelect() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sfx/tap1.mp3")
    );
    setSound(sound);
    await sound.playAsync();
  }

  const handleAdd = async () => {
    if (
      !(
        difficulty === "easy" ||
        difficulty === "medium" ||
        difficulty === "hard"
      )
    ) {
      alert("Invalid difficulty entered!");
    }

    const subTasksArr = subTasks.split(",");

    const data = {
      title: title,
      subTasks: subTasksArr,
      difficulty: difficulty,
      owner: user.email,
    };

    await setDoc(doc(db, "tasks", title), data).then(() =>
      console.log("setDoc for setting task")
    );
    user["tasks"].unshift(data.title);
    setUser({
      activeQuest: user.activeQuest,
      coins: user.coins,
      emotes: user.emotes,
      items: user.items,
      currentXp: user.currentXp,
      diamonds: user.diamonds,
      displayName: user.displayName,
      email: user.email,
      level: user.level,
      multiplier: user.multiplier,
      questsDone: user.questsDone,
      tasks: user.tasks,
      avatar: user.avatar,
    });

    const userRef = doc(db, "users", user.email);
    await updateDoc(userRef, {
      tasks: user.tasks,
    }).then(() => console.log("updateDoc for adding task"));

    playSubmit();
    navigation.goBack();
  };

  return (
    <View>
      <ImageBackground
        source={require("../assets/backgrounds/background.png")}
        style={styles.bg}
      >
        <View style={styles.banner}>
          <Text style={styles.bannerText}>ADD TASK</Text>
        </View>
        <View style={styles.inputFieldsContainer}>
          <ImageBackground
            source={require("../assets/backgrounds/inputFieldBubble.png")}
            style={styles.inputFieldContainer}
          >
            <TextInput
              style={styles.inputFields}
              onChangeText={setTitle}
              value={title}
              placeholder="Name the task."
              onPressIn={(e) => {
                e.preventDefault();
                playSelect();
              }}
              placeholderTextColor="black"
            />
          </ImageBackground>
          <ImageBackground
            source={require("../assets/backgrounds/inputFieldBubble.png")}
            style={styles.inputFieldContainer}
          >
            <TextInput
              style={styles.inputFields}
              onChangeText={setSubTasks}
              value={subTasks}
              placeholder="Break the task into smaller sub-tasks(Each sub task should be separated by commas)."
              onPressIn={(e) => {
                e.preventDefault();
                playSelect();
              }}
              placeholderTextColor="black"
            />
          </ImageBackground>
          <ImageBackground
            source={require("../assets/backgrounds/inputFieldBubble.png")}
            style={styles.inputFieldContainer}
          >
            <TextInput
              style={styles.inputFields}
              onChangeText={setDifficulty}
              value={difficulty}
              placeholder="How difficult is the task(Only easy, medium and hard will be accepted)?"
              onPressIn={(e) => {
                e.preventDefault();
                playSelect();
              }}
              placeholderTextColor="black"
            />
          </ImageBackground>
          <Pressable onPress={handleAdd}>
            <Image
              source={require("./../assets/buttons/add.png")}
              style={styles.submit}
            />
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  bg: {
    width: "100%",
    height: "100%",
  },
  banner: {
    backgroundColor: "#DD4141",
    width: "100%",
  },
  bannerText: {
    fontSize: 60,
    fontFamily: "PlayMeGames",
    color: "white",
    textAlign: "center",
    paddingTop: 4,
  },
  inputFields: {
    backgroundColor: "transparent",
    fontFamily: "PlayMeGames",
    color: "black",
    marginLeft: 15,
    marginTop: 10,
  },
  inputFieldsContainer: {
    marginTop: 50,
  },
  inputFieldContainer: {
    resizeMode: "cover",
    width: 320,
    height: 50,
    marginTop: 25,
    marginLeft: 15,
  },
  submit: {
    width: "100%",
    height: "35%",
    resizeMode: "contain",
    top: 50,
  },
});

export default AddTask;
