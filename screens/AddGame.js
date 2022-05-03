import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import Topbar from "../components/Topbar";
import BottomBar from "../components/BottomBar";
import { useContext, useEffect } from "react/cjs/react.development";
import { deleteDoc, doc, setDoc } from "@firebase/firestore";
import { UserContext } from "../UserContext";
import { db } from "../firebase";

const AddGame = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext);
  const id = String(
    Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))
  );

  const [bodyJSX, setBodyJSX] = useState(
    <View style={styles.container}>
      <Text style={styles.text}>Waiting for players to join</Text>
      <ActivityIndicator color="#ffff" size="large" />
    </View>
  );

  useEffect(() => {
    setDoc(doc(db, "games", id), {
      id: id,
      created: Date.now(),
      finished: false,
      started: false,
      player1: user,
      player2: null,
    });
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener("blur", () => {
      deleteDoc(doc(db, "games", id));
    });
  });

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
