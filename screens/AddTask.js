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

const AddTask = () => {
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
      owner: user["email"],
    };

    await setDoc(doc(db, "tasks", title), data);
    user["tasks"].unshift(data["title"]);
    setUser({
      activeQuest: user["activeQuest"],
      coins: user["coins"],
      emotes: user["emotes"],
      items: user["items"],
      currentXp: user["currentXp"],
      diamonds: user["diamonds"],
      displayName: user["displayName"],
      email: user["email"],
      level: user["level"],
      multiplier: user["multiplier"],
      questsDone: user["questsDone"],
      tasks: user["tasks"],
      avatar: user["avatar"],
    });

    const userRef = doc(db, "users", user["email"]);
    await updateDoc(userRef, {
      tasks: user["tasks"],
    });
    alert("Task added!");
  };

  return (
    <View>
      <ImageBackground
        source={require("../assets/background.png")}
        style={styles.bg}
      >
        <View style={styles.banner}>
          <Text style={styles.bannerText}>ADD TASK</Text>
        </View>
        <View style={styles.inputFieldsContainer}>
          <TextInput
            style={styles.inputFields}
            onChangeText={setTitle}
            value={title}
            placeholder="Name the task."
          />
          <TextInput
            style={styles.inputFields}
            onChangeText={setSubTasks}
            value={subTasks}
            placeholder="Break the task into smaller sub-tasks(Each sub task should be separated by commas)."
          />
          <TextInput
            style={styles.inputFields}
            onChangeText={setDifficulty}
            value={difficulty}
            placeholder="How difficult is the task(Only easy, medium and hard will be accepted)?"
          />
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
    marginTop: 50,
    width: "100%",
    backgroundColor: "white",
    height: "10%",
  },
  inputFieldsContainer: {
    marginTop: 50,
  },
  submit: {
    width: "100%",
    height: "35%",
    resizeMode: "contain",
    top: 50,
  },
});

export default AddTask;
