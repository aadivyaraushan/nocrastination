import {
  View,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
  Pressable,
  Animated,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import BottomBar from "../components/BottomBar";
import { UserContext } from "../UserContext";

function Quest({ navigation }) {
  const { user, setUser } = useContext(UserContext);
  const percentComplete =
    Math.round((user["questsDone"] / user["questsToDo"]) * 100).toString() +
    "%";

  console.log(
    "Percent complete: " + percentComplete + "\nType: " + typeof percentComplete
  );

  return (
    <View>
      <ImageBackground
        source={require("../assets/background.png")}
        style={styles.bg}
      >
        <Image
          source={require("../assets/swordProgressBar.png")}
          style={styles.sword}
        />
        <View style={styles.bar}>
          {/* <View
            style={
              ([StyleSheet.absoluteFill],
              { backgroundColor: "#8BED4F", height: "50%" })
            }
          /> */}
          <View
            style={{
              width: 50,
              flexDirection: "column",
              justifyContent: "flex-start",
              height: percentComplete,
              backgroundColor: "#3DDF58",
              alignSelf: "center",
              justifyContent: "center",
              top: 310,
              paddingLeft: 10,
              paddingRight: 10,
            }}
          />
        </View>
        <Image
          style={styles.banner}
          source={require("../assets/questsBanner.png")}
        />
        <Topbar style={styles.topbar} />

        <BottomBar />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  banner: {
    width: "100%",
    resizeMode: "contain",
    position: "absolute",
    top: -5,
  },
  button: {
    resizeMode: "contain",
    width: 350,
    top: 100,
    alignSelf: "center",
    marginBottom: 5,
  },
  bar: {
    width: 50,
    flexDirection: "column",
    height: "100%",
    backgroundColor: "white",
    alignSelf: "center",
    justifyContent: "center",
    top: -480,
  },
  sword: {
    alignSelf: "center",
    resizeMode: "contain",
    width: 100,
    top: 340,
    zIndex: 1,
  },
  topbar: {
    zIndex: 2,
    position: "absolute",
    top: 0,
  },
});

export default Quest;
