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
import {
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  query,
  collection,
  where,
} from "firebase/firestore";
import { UserContext } from "../UserContext";
import { db } from "../firebase";
import { GameContext } from "../GameContext";

const id = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
console.log("ID: ", id);

const AddGame = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext);
  const { game, setGame } = useContext(GameContext);

  const [bodyJSX, setBodyJSX] = useState(
    <View style={styles.container}>
      <Text style={styles.text}>Adding game to queue</Text>
      <ActivityIndicator color="#ffff" size="large" />
    </View>
  );

  useEffect(() => {
    setDoc(doc(db, "games", String(id)), {
      id: String(id),
      created: Date.now(),
      finished: false,
      started: false,
      player1: user,
      player2: null,
    })
      .then(() => {
        console.log("Game added to database");
        setGame({
          id: String(id),
          created: Date.now(),
          finished: false,
          started: false,
          player1: user,
          player2: null,
        });
      })
      .then(() => {
        onSnapshot(doc(db, "games", String(id)), (snapshot) => {
          setGame(snapshot.data());
        });
      })
      .catch((error) => console.log(error));
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
    fontFamily: "RetroGaming",
    color: "white",
    textAlign: "center",
  },
  text: {
    fontSize: 25,
    textAlign: "center",
    width: "100%",
    color: "white",
    fontFamily: "RetroGaming",
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
