import { StatusBar } from "expo-status-bar";
import {
  TextInput,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
} from "react-native";
import { useState, useContext } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, setDoc, getFirestore, doc } from "firebase/firestore";
import { auth, db } from "../firebase.js";
import { UserContext } from "../UserContext.js";
import { useFonts } from "expo-font";
import { Audio } from "expo-av";

function Signup({ navigation }) {
  const [sound, setSound] = useState();
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [displayName, onChangeDisplayName] = useState("");
  const { user, setUser } = useContext(UserContext);
  const [] = useFonts({
    RetroGaming: require("../assets/fonts/RetroGaming-Regular.ttf"),
    InkyThinPixels: require("../assets/fonts/InkyThinPixels-Regular.ttf"),
    PlayMeGames: require("../assets/fonts/Playmegames-Regular.ttf"),
  });
  const avatars = ["wizard", "necromancer"];
  const [avatar, setAvatar] = useState();
  async function playSubmit() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sfx/tap2.mp3")
    );
    setSound(sound);
    await sound.playAsync();
  }
  async function playSelect() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sfx/tap1.mp3")
    );
    setSound(sound);
    await sound.playAsync();
  }

  const handleSignUp = async () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        var user = userCredentials.user;
      })
      .catch((error) => alert(error.message));

    try {
      const docRef = doc(db, "users", email);

      const data = {
        activeQuest: "",
        avatar,
        coins: 0,
        currentXp: 0,
        diamonds: 0,
        displayName: displayName,
        email: email,
        emotes: [],
        items: [],
        level: 1,
        questsDone: 0,
        tasks: [],
      };

      playSubmit();

      await setDoc(docRef, data).then(() =>
        console.log("setDoc for setting user")
      );

      await setUser(data);

      navigation.navigate("homepage");
    } catch (e) {
      alert("Error: ", e.message);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.bg}
        source={require("./../assets/background.png")}
      >
        <Image
          source={require("./../assets/signupBanner.png")}
          style={styles.banner}
        />
        <View style={styles.inputFieldsContainer}>
          <ImageBackground
            source={require("../assets/inputFieldBubble.png")}
            style={styles.inputFieldContainer}
          >
            <TextInput
              style={styles.inputFields}
              onChangeText={onChangeDisplayName}
              value={displayName}
              placeholder="Display Name"
              placeholderTextColor="black"
            />
          </ImageBackground>
          <ImageBackground
            source={require("../assets/inputFieldBubble.png")}
            style={styles.inputFieldContainer}
          >
            <TextInput
              style={styles.inputFields}
              onChangeText={onChangeEmail}
              placeholder="Email"
              placeholderTextColor="black"
              value={email}
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
          <ScrollView style={styles.avatarsContainer} horizontal={true}>
            {avatars.map((avatar, index) => {
              let image;
              switch (avatar) {
                case "wizard":
                  image = require("../assets/avatars/wizard.gif");
                  break;
                case "necromancer":
                  image = require("../assets/avatars/necromancer.gif");
                  break;
              }
              return (
                <ImageBackground
                  style={styles.avatarBackground}
                  source={require("../assets/shopPanel.png")}
                  key={index}
                >
                  <Pressable
                    onPress={() => {
                      setAvatar(avatar);
                      playSelect();
                    }}
                    android_disableSound={true}
                  >
                    <Text style={styles.avatarText}>{avatar}</Text>
                    <Image style={styles.avatarImage} source={image}></Image>
                  </Pressable>
                </ImageBackground>
              );
            })}
          </ScrollView>
          <Pressable onPress={handleSignUp} android_disableSound={true}>
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
export default Signup;

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
    marginTop: 50,
  },
  inputFieldContainer: {
    resizeMode: "cover",
    width: 320,
    height: 50,
    marginTop: 25,
    marginLeft: 15,
  },
  submit: {
    width: "100%",
    height: "40%",
    resizeMode: "contain",
    top: 50,
  },
  avatarsContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  avatarBackground: {
    width: 110,
    height: 150,
    resizeMode: "contain",
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
  },
  avatarText: {
    fontSize: 25,
    fontFamily: "PlayMeGames",
    color: "white",
    textAlign: "center",
  },
  avatarImage: {
    height: "40%",
    width: "auto",
    resizeMode: "contain",
  },
});
