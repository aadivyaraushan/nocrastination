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

const AddTask = () => {
  const [title, setTitle] = useState();
  const [subTasks, setSubTasks] = useState();
  const [difficulty, setDifficulty] = useState();

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
    setUser({
      coins: user["coins"],
      currentXp: user["currentXp"],
      diamonds: user["diamonds"],
      displayName: user["displayName"],
      email: user["email"],
      level: user["level"],
      multiplier: user["multiplier"],
      questsDone: user["questsDone"],
      questsToDo: user["questsToDo"] + 1,
    });

    const userRef = doc(db, "users", user["email"]);
    await updateDoc(userRef, {
      questsToDo: user["questsToDo"],
    });
  };

  return (
    <View>
      <ImageBackground
        source={require("../assets/background.png")}
        style={styles.bg}
      >
        <Image
          source={require("../assets/addTaskBanner.png")}
          style={styles.banner}
        />
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
    resizeMode: "contain",
    position: "absolute",
    top: 0,
    width: "100%",
    height: "10%",
    backgroundColor: "black",
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
    height: "40%",
    resizeMode: "contain",
    top: 50,
  },
});

export default AddTask;
