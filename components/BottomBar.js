import { StyleSheet, View, Text, Image } from "react-native";
import react from "react";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react/cjs/react.development";
import { Audio } from "expo-av";

function BottomBar() {
  const navigation = useNavigation();
  const [sound, setSound] = useState();

  async function playTap1() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sfx/tap1.mp3")
    );
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          playTap1();
          navigation.navigate("shop");
        }}
        android_disableSound={true}
      >
        <Image
          source={require("../assets/shopIcon.png")}
          style={styles.icon}
        ></Image>
      </Pressable>
      <Pressable
        onPress={() => {
          playTap1();
          navigation.navigate("battleselect");
        }}
        android_disableSound={true}
      >
        <Image
          source={require("../assets/questsIcon.png")}
          style={styles.icon}
        ></Image>
      </Pressable>
      <Pressable
        onPress={() => {
          playTap1();
          navigation.navigate("addtask");
        }}
        android_disableSound={true}
      >
        <Image
          source={require("../assets/addTaskIcon.png")}
          style={styles.icon}
        ></Image>
      </Pressable>
      <Pressable
        onPress={() => {
          playTap1();
          navigation.navigate("organisations");
        }}
        android_disableSound={true}
      >
        <Image
          source={require("../assets/socialIcon.png")}
          style={styles.icon}
        ></Image>
      </Pressable>
      <Pressable
        onPress={() => {
          playTap1();
          navigation.navigate("settings");
        }}
        android_disableSound={true}
      >
        <Image
          source={require("../assets/settingsIcon.png")}
          style={styles.icon}
        ></Image>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    resizeMode: "contain",
    width: 80,
    height: 80,
  },
  container: {
    flexDirection: "row",
    backgroundColor: "#2D2D2D",
    width: "100%",
    height: 80,
    justifyContent: "space-around",
    flex: 1,
    position: "absolute",
    bottom: 0,
  },
});

export default BottomBar;
