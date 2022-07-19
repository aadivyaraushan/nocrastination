import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Pressable,
} from "react-native";
import { Audio } from "expo-av";
import { useState, useEffect } from "react";
import { useFonts } from "expo-font";

function AuthenticationScreen({ navigation }) {
  const [sound, setSound] = useState();
  const [loaded, error] = useFonts({
    RetroGaming: require("../assets/fonts/RetroGaming-Regular.ttf"),
    InkyThinPixels: require("../assets/fonts/InkyThinPixels-Regular.ttf"),
    PlayMeGames: require("../assets/fonts/Playmegames-Regular.ttf"),
  });
  console.log(loaded, error);

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sfx/tap1.mp3")
    );
    setSound(sound);

    await sound.playAsync();
  }

  // useEffect(() => {
  //   return sound
  //     ? () => {
  //         console.log("Unloading Sound");
  //         sound.unloadAsync();
  //       }
  //     : undefined;
  // }, [sound]);

  return (
    loaded && (
      <View style={styles.container}>
        <ImageBackground
          style={styles.bg}
          source={require("./../assets/backgrounds/background.png")}
        >
          <View style={styles.banner}>
            <Text
              style={{
                fontSize: 60,
                fontFamily: "PlayMeGames",
                color: "white",
                textAlign: "center",
                paddingTop: 4,
              }}
            >
              WELCOME
            </Text>
          </View>
          <View style={styles.buttonsContainer}>
            <Pressable
              onPress={() => {
                // playSound();
                navigation.navigate("login");
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
                // playSound();
                navigation.navigate("signup");
              }}
              android_disableSound={true}
            >
              <Image
                source={require("./../assets/buttons/signup.png")}
                c
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
    )
  );
}

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
  bg: {
    width: "100%",
    height: "100%",
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
