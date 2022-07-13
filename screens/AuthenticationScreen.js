import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Pressable,
  Dimensions
} from "react-native";
import { Audio } from "expo-av";
import { useState, useEffect } from "react";
import { useFonts } from "expo-font";

function AuthenticationScreen({ navigation }) {
  const [sound, setSound] = useState();
  const [] = useFonts({
    RetroGaming: require("../assets/fonts/RetroGaming-Regular.ttf"),
    InkyThinPixels: require("../assets/fonts/InkyThinPixels-Regular.ttf"),
    PlayMeGames: require("../assets/fonts/Playmegames-Regular.ttf"),
  });

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sfx/tap1.mp3")
    );
    setSound(sound);

    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.bg}
        source={require("./../assets/background.png")}
      >
        <Image
          source={require("./../assets/welcomeBanner.png")}
          style={styles.banner}
        />
        <View style={styles.buttonsContainer}>
          <Pressable
            onPress={() => {
              navigation.navigate("login");
              playSound();
            }}
            android_disableSound={true}
          >
            <Image
              source={require("./../assets/buttons/login.png")}
              style={styles.buttons}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate("signup");
              playSound();
            }}
            android_disableSound={true}
          >
            <Image
              source={require("./../assets/buttons/signup.png")}
              style={styles.buttons}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              alert("Under development!");
              playSound();
            }}
            android_disableSound={true}
          >
            <Image
              source={require("./../assets/buttons/classcode.png")}
              style={styles.buttons}
            />
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default AuthenticationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  banner: {
    resizeMode: "contain",
    position: "absolute",
    top: 0,
    width: "100%",
    height: "10%",
    backgroundColor: "black",
  },
  bg: {
    width: windowWidth,
    height: windowHeight,
    justifyContent: "flex-start",
  },
  buttons: {
    marginTop: 50,
    width: "100%",
    resizeMode: "contain",
  },
  buttonsContainer: {
    top: 100,
  },
  bottomBar: {
    flex: 0.1,
  },
});
