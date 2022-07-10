import {
  TextInput,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Pressable,
} from "react-native";
import { useContext, useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { UserContext } from "../UserContext.js";
import { auth, db } from "../firebase";
import { Audio } from "expo-av";
import { useFonts } from "expo-font";

let userCred = null;

function Login({ navigation }) {
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [sound, setSound] = useState();
  const { user, setUser } = useContext(UserContext);
  const [] = useFonts({
    RetroGaming: require("../assets/fonts/RetroGaming-Regular.ttf"),
    InkyThinPixels: require("../assets/fonts/InkyThinPixels-Regular.ttf"),
    PlayMeGames: require("../assets/fonts/Playmegames-Regular.ttf"),
  });

  const handleLogin = async () => {
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        userCred = userCredentials.user;
      })
      .catch((error) => alert(error.message));

    const docRef = await doc(db, "users", userCred.email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUser(docSnap.data());
      playSound();
      navigation.navigate("homepage");
    } else console.log("No such document!");
  };

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sfx/tap2.mp3")
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
          source={require("./../assets/loginBanner.png")}
          style={styles.banner}
        />
        <View style={styles.inputFieldsContainer}>
          <ImageBackground
            source={require("../assets/inputFieldBubble.png")}
            style={styles.inputFieldContainer}
          >
            <TextInput
              style={styles.inputFields}
              onChangeText={onChangeEmail}
              value={email}
              placeholder="Email"
              placeholderTextColor="black"
            />
          </ImageBackground>

          <ImageBackground
            source={require("../assets/inputFieldBubble.png")}
            style={styles.inputFieldContainer}
          >
            <TextInput
              style={styles.inputFields}
              onChangeText={onChangePassword}
              value={password}
              placeholder="Password"
              placeholderTextColor="black"
              secureTextEntry
            />
          </ImageBackground>

          <Pressable onPress={handleLogin} android_disableSound={true}>
            <Image
              source={require("./../assets/buttons/submit.png")}
              style={styles.submit}
            />
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

export default Login;

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
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
  },
  inputFields: {
    backgroundColor: "transparent",
    fontFamily: "PlayMeGames",
    color: "black",
    marginLeft: 15,
    marginTop: 10,
  },
  inputFieldsContainer: {
    marginTop: 80,
    display: "flex",
  },
  submit: {
    width: "100%",
    height: "40%",
    resizeMode: "contain",
    top: 50,
  },
  inputFieldContainer: {
    resizeMode: "cover",
    width: 320,
    height: 50,
    marginTop: 25,
    marginLeft: 15,
  },
});
