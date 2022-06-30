import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Topbar from "../components/Topbar";
import BottomBar from "../components/BottomBar";
import { deleteDoc, doc } from "firebase/firestore";
import { set, ref } from "firebase/database";
import { UserContext } from "../UserContext";
import { db, rtdb } from "../firebase";
import { GameContext } from "../GameContext";
import { QuestContext } from "../QuestContext";
import { useFonts } from "expo-font";

const id = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
console.log("ID: ", id);

const AddGame = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext);
  const { game, setGame } = useContext(GameContext);
  const { quest, setQuest } = useContext(QuestContext);

  const [] = useFonts({
    RetroGaming: require("../assets/fonts/RetroGaming-Regular.ttf"),
    InkyThinPixels: require("../assets/fonts/InkyThinPixels-Regular.ttf"),
    PlayMeGames: require("../assets/fonts/Playmegames-Regular.ttf"),
  });

  const [bodyJSX, setBodyJSX] = useState(
    <View style={styles.container}>
      <Text style={styles.text}>Adding game to queue</Text>
      <ActivityIndicator color="#ffff" size="large" />
    </View>
  );

  useEffect(() => {
    // setDoc(doc(db, "games", String(id)), {
    //   id: String(id),
    //   created: Date.now(),
    //   finished: false,
    //   started: false,
    //   player1: {
    //     difficultyQuest: quest["difficulty"],
    //     subTasks: quest["subTasks"],
    //     taskTitle: quest["title"],
    //     avatar: user["avatar"],
    //     displayName: user["displayName"],
    //     items: user["items"],
    //     emotes: user["emotes"],
    //   },
    //   player2: null,
    // })
    //   .then(() => {
    //     console.log("Game added to database");
    //     setGame({
    //       id: String(id),
    //       created: Date.now(),
    //       finished: false,
    //       started: false,
    //       player1: {
    //         email: user["email"],
    //         difficultyQuest: quest["difficulty"],
    //         subTasks: quest["subTasks"],
    //         taskTitle: quest["title"],
    //         avatar: user["avatar"],
    //         displayName: user["displayName"],
    //         items: user["items"],
    //         emotes,
    //         level: user["level"],
    //       },
    //       player2: null,
    //     });
    //   })
    //   .then(() => {
    //     onSnapshot(doc(db, "games", String(id)), (snapshot) => {
    //       setGame(snapshot.data());
    //     });
    //   })
    //   .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      deleteDoc(doc(db, "games", String(id)));
    });
  }, [navigation]);

  useEffect(() => {
    if (game != null) {
      setBodyJSX(
        <View style={styles.container}>
          <Text style={styles.text}>Waiting for a player to join</Text>
          <ActivityIndicator color="#ffff" size="large" />
        </View>
      );
      if (game["player2"]) {
        setBodyJSX(
          <View style={styles.container}>
            <Text style={styles.text}>Player found!</Text>
          </View>
        );
        navigation.navigate("multiplayerBattle");
      }
    }
  }, [game]);

  return (
    <View>
      <ImageBackground
        source={require("../assets/background.png")}
        style={styles.bg}
      >
        <Topbar />
        <BottomBar />
        {bodyJSX}
      </ImageBackground>
    </View>
  );
};

export default AddGame;

const styles = StyleSheet.create({
  bg: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    display: "flex",
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
  text: {
    fontSize: 25,
    textAlign: "center",
    width: "100%",
    color: "white",
    fontFamily: "PlayMeGames",
    alignSelf: "center",
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
});
