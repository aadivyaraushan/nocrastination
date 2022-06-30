import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import React, { useState } from "react";
import Topbar from "../components/Topbar";
import BottomBar from "../components/BottomBar";
import { useContext, useEffect } from "react/cjs/react.development";
import {
  collection,
  doc,
  getDocs,
  query,
  QuerySnapshot,
  updateDoc,
  where,
} from "@firebase/firestore";
import { db } from "../firebase";
import { NavigationContainer } from "@react-navigation/native";
import { UserContext } from "../UserContext";
import { GameContext } from "../GameContext";
import { Audio } from "expo-av";
import { useFonts } from "expo-font";

const LoadingMatchmaking = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext);
  const { game, setGame } = useContext(GameContext);
  const [gamesJSX, setGamesJSX] = useState();
  const games = [];
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
  async function playAdd() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sfx/tap1.mp3")
    );
    setSound(sound);
    await sound.playAsync();
  }

  const pressHandler = (gameFromGames) => {
    updateDoc(doc(db, "games", gameFromGames["id"]), {
      player2: user,
    })
      .then(() => {
        setGame({
          created: gameFromGames["created"],
          finished: gameFromGames["finished"],
          id: gameFromGames["id"],
          player1: gameFromGames["player1"],
          player2: user,
          started: gameFromGames["started"],
        });
      })
      .then(() => {
        playSelect();
        navigation.navigate("multiplayerBattle");
      });
  };

  useEffect(() => {
    getDocs(query(collection(db, "games"), where("player2", "==", null)))
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          games.push(doc.data());
        });
      })
      .then(() => {
        setGamesJSX(
          <View style={styles.gamesContainer}>
            {games.map((gameFromGames, index) => {
              if (
                gameFromGames["player1"]["difficultyQuest"] ===
                  quest["difficulty"] &&
                gameFromGames["player1"]["level"] === user["level"]
              ) {
                return (
                  <ImageBackground
                    source={require("../assets/organisationBG.png")}
                    style={styles.gameBackground}
                    key={Math.random() * index}
                  >
                    <Pressable
                      onPress={() => pressHandler(gameFromGames)}
                      key={index}
                      style={styles.gamePressable}
                    >
                      <Text style={styles.gameText}>Game {index + 1}</Text>
                      <Text style={styles.gameDetails}>
                        Against: {gameFromGames["player1"]["displayName"]}
                      </Text>
                      <Text style={styles.gameDetails}>
                        Level: {gameFromGames["player1"]["level"]},{" "}
                      </Text>
                      <Text style={styles.gameDetails}>
                        {gameFromGames["player1"]["items"].length} items
                      </Text>
                    </Pressable>
                  </ImageBackground>
                );
              }
            })}
          </View>
        );
      });
  }, []);

  return (
    <View>
      <ImageBackground
        source={require("../assets/background.png")}
        style={styles.bg}
      >
        <Topbar />
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Battle</Text>
        </View>
        {gamesJSX}
        <Pressable
          style={styles.addGameButton}
          onPress={() => {
            playAdd();
            navigation.navigate("addGame");
          }}
          android_disableSound={true}
        >
          <Image
            source={require("../assets/addGame.png")}
            style={styles.addGameImage}
          />
        </Pressable>
        <BottomBar />
      </ImageBackground>
    </View>
  );
};

export default LoadingMatchmaking;

const styles = StyleSheet.create({
  bg: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    display: "flex",
  },
  text: {
    fontSize: 25,
    textAlign: "center",
    width: "100%",
    color: "white",
    fontFamily: "PlayMeGames",
    alignSelf: "center",
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
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "70%",
  },
  gamesContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  gameBackground: {
    width: 380,
    height: 120,
    resizeMode: "contain",
    margin: 20,
    padding: 10,
  },
  gamePressable: {},
  gameText: {
    fontSize: 30,
    fontFamily: "PlayMeGames",
    color: "white",
    textAlign: "center",
  },
  gameDetails: {
    fontSize: 15,
    fontFamily: "PlayMeGames",
    color: "white",
    textAlign: "left",
  },
  addGameButton: {
    width: 80,
    height: 80,
    position: "absolute",
    bottom: 90,
    right: 10,
    zIndex: 2,
  },
  addGameImage: {
    width: 80,
    height: 80,
  },
});
