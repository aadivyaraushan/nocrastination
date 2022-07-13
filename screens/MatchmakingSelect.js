import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions
} from "react-native";
import React, { useState } from "react";
import Topbar from "../components/Topbar";
import BottomBar from "../components/BottomBar";
import { useContext, useEffect } from "react/cjs/react.development";
import { get, ref, child, update } from "firebase/database";
import { db, rtdb } from "../firebase";
import { NavigationContainer } from "@react-navigation/native";
import { UserContext } from "../UserContext";
import { GameContext } from "../GameContext";
import { QuestContext } from "../QuestContext";
import { Audio } from "expo-av";
import { useFonts } from "expo-font";
import { getDoc, doc } from "firebase/firestore";

const LoadingMatchmaking = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext);
  const { game, setGame } = useContext(GameContext);
  const { quest, setQuest } = useContext(QuestContext);
  const [gamesJSX, setGamesJSX] = useState(<></>);
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

  const pressHandler = (game, id) => {
    console.log("pressHandler triggered");

    let healthBoost = 0;
    let damageBoost = 0;

    let items = [];
    for (let itemName of user["items"]) {
      console.log(itemName);
      getDoc(doc(db, "shop", itemName)).then((docSnap) => {
        if (docSnap.exists()) items.push(docSnap.data());
      });
    }

    // boost calculations
    for (const item of items) {
      if (item["name"] == "regeneration") {
        // special regeneration stuff
      } else if (item["type"] == "offensive")
        damageBoost += item["damageBoost"];
      else if (item["type"] == "deensive") healthBoost += item["healthBoost"];
    }
    // damage calculation
    const damage = 100 / quest["subTasks"].length + damageBoost;

    // health calculation
    let health = 100 + healthBoost;

    const updates = {};
    updates[`/games/${id}/avatars/player2`] = user["avatar"];
    updates[`/games/${id}/difficulty/player2`] = quest["difficulty"];
    updates[`/games/${id}/healths/player2`] = health;
    updates[`/games/${id}/damages/player2`] = damage;
    updates[`/games/${id}/levels/player2`] = user["level"];
    updates[`/games/${id}/names/player2`] = user["displayName"];
    updates[`/games/${id}/numberOfItems/player2`] = items.length;
    updates[`/games/${id}/subTasks/player2`] = quest["subTasks"];
    updates[`/games/${id}/emails/player2`] = user["email"];
    setGame(id);

    update(ref(rtdb), updates).then(() =>
      navigation.navigate("multiplayerBattle")
    );
  };

  useEffect(() => {
    get(child(ref(rtdb), `games`)).then((games) => {
      let jsx = [];

      Object.entries(games.val()).forEach((entry, index) => {
        const [key, value] = entry;
        if (
          value["difficulty"]["player1"] === quest["difficulty"] &&
          value["levels"]["player1"] === user["level"]
        ) {
          jsx.push(
            <ImageBackground
              source={require("../assets/organisationBG.png")}
              style={styles.gameBackground}
              key={Math.random() * (index + 2)}
            >
              <Pressable
                onPress={() => pressHandler(value, key)}
                key={index + 1}
                style={styles.gamePressable}
              >
                <Text style={styles.gameText}>Game {index + 1}</Text>
                <Text style={styles.gameDetails}>
                  Against: {value["names"]["player1"]}
                </Text>
                <Text style={styles.gameDetails}>
                  Level: {value["levels"]["player1"]}
                </Text>
                <Text style={styles.gameDetails}>
                  {value["numberOfItems"]["player1"]} items
                </Text>
              </Pressable>
            </ImageBackground>
          );
        }
      });
      setGamesJSX(
        <>
          <View style={styles.gamesContainer}>{jsx}</View>
        </>
      );
    });
  }, []);

  return (
    <>
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
    </>
  );
};
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default LoadingMatchmaking;

const styles = StyleSheet.create({
  bg: {
    width: windowWidth,
    height: windowHeight,
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
