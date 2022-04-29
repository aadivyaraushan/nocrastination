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
import { useContext, useEffect } from "react/cjs/react.development";
import { UserContext } from "../UserContext";
import { QuestContext } from "../QuestContext";
import {
  collection,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "@firebase/firestore";
import { db } from "../firebase";

const PickATask = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext);
  const { quest, setQuest } = useContext(QuestContext);

  const pressHandler = (taskTitle) => {
    getDocs(query(collection(db, "tasks"), where("title", "==", taskTitle)))
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setQuest(doc.data());
        });
      })
      .then(() => {
        navigation.navigate("multiplayerBattle");
      });
  };

  console.log(user);
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
    fontFamily: "RetroGaming",
    color: "white",
    textAlign: "center",
  },
  tasksText: {
    fontSize: 20,
    fontFamily: "RetroGaming",
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
