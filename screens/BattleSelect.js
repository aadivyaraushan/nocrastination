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

const BattleSelect = ({ navigation }) => {
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
        <Pressable
          style={styles.buttonContainer1}
          onPress={() => {
            navigation.navigate("quests");
          }}
        >
          <Image
            source={require("../assets/singleplayerButton.png")}
            style={styles.button}
          />
        </Pressable>
        <Pressable
          style={styles.buttonContainer2}
          onPress={() => {
            navigation.navigate("taskSelect");
          }}
        >
          <Image
            source={require("../assets/multiplayerButton.png")}
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
    fontSize: 40,
    fontFamily: "RetroGaming",
    color: "white",
    textAlign: "center",
  },
});
