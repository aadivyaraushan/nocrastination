import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import React from "react";
import Topbar from "../components/Topbar";
import BottomBar from "../components/BottomBar";
import { useState } from "react";
import { Audio } from "expo-av";
import { useFonts } from "expo-font";

const BattleSelect = ({ navigation }) => {
  const [sound, setSound] = useState();
  const [] = useFonts({
    RetroGaming: require("../assets/fonts/RetroGaming-Regular.ttf"),
    InkyThinPixels: require("../assets/fonts/InkyThinPixels-Regular.ttf"),
    PlayMeGames: require("../assets/fonts/Playmegames-Regular.ttf"),
  });

  async function playTap() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sfx/tap2.mp3")
    );
    setSound(sound);

    await sound.playAsync();
  }

  return (
    <View>
      <ImageBackground
        source={require("../assets/backgrounds/background.png")}
        style={styles.bg}
      >
        <Topbar />
        <View style={styles.banner}>
          <Text style={styles.bannerText}>BATTLE</Text>
        </View>
        <Pressable
          style={styles.buttonContainer1}
          onPress={() => {
            playTap();
            navigation.navigate("quests");
          }}
          android_disableSound={true}
        >
          <Image
            source={require("../assets/buttons/singleplayerButton.png")}
            style={styles.button}
          />
        </Pressable>
        <Pressable
          style={styles.buttonContainer2}
          onPress={() => {
            playTap();
            navigation.navigate("taskSelect");
          }}
          android_disableSound={true}
        >
          <Image
            source={require("../assets/buttons/multiplayerButton.png")}
            style={styles.button}
          />
        </Pressable>
        <BottomBar />
      </ImageBackground>
    </View>
  );
};

export default BattleSelect;

const styles = StyleSheet.create({
  bg: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  buttonContainer1: {
    width: 400,
    marginTop: 50,
  },
  buttonContainer2: {
    width: 400,
    top: -20,
    marginTop: 20,
  },
  button: {
    resizeMode: "contain",
    width: 400,
    alignSelf: "center",
  },
  banner: {
    marginTop: 50,
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
});
