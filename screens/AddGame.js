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
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { set, ref, onValue, remove, child } from "firebase/database";
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
    let player1HealthBoost = 0;
    let player1DamageBoost = 0;
    let player1Avatar = "";

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
        player1DamageBoost += item["damageBoost"];
      else if (item["type"] == "deensive")
        player1HealthBoost += item["healthBoost"];
    }
    // damage calculation
    const player1Damage = 100 / quest["subTasks"].length + player1DamageBoost;

    // health calculation
    let player1Health = 100 + player1HealthBoost;

    // creating game
    set(ref(rtdb, `games/${id}`), {
      names: {
        player1: user["displayName"],
        player2: "",
      },
      healths: {
        player1: player1Health,
        player2: 0,
      },
      subTasks: {
        player1: quest["subTasks"],
        player2: [],
      },
      avatars: {
        player1: user["avatar"],
        player2: "",
      },
      numberOfItems: {
        player1: user["items"].length,
        player2: 0,
      },
      levels: {
        player1: user["level"],
        player2: 0,
      },
      difficulty: {
        player1: quest["difficulty"],
        player2: "",
      },
      damages: {
        player1: player1Damage,
        player2: 0,
      },
      emails: {
        player1: user["email"],
        player2: "",
      },
    })
      .then(() => {
        setBodyJSX(
          <View style={styles.container}>
            <Text style={styles.text}>Waiting for a player to join</Text>
            <ActivityIndicator color="#ffff" size="large" />
          </View>
        );

        onValue(ref(rtdb, `games/${id}/names/player2`), (snapshot) => {
          if (snapshot.val() != "") {
            setBodyJSX(
              <View style={styles.container}>
                <Text style={styles.text}>Player found!</Text>
              </View>
            );
            navigation.navigate("multiplayerBattle");
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      // deleteDoc(doc(db, "games", String(id)));
      remove(ref(rtdb, `games/${id}`));
    });
  }, [navigation]);

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
