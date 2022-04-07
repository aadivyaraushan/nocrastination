import { StatusBar } from "expo-status-bar";
import {
  TextInput,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Pressable,
} from "react-native";
import { useState, useContext } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, setDoc, getFirestore, doc } from "firebase/firestore";
import { auth, db } from "../firebase.js";
import { UserContext } from "../UserContext.js";

function Signup({ navigation }) {
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [displayName, onChangeDisplayName] = useState("");
  const { user, setUser } = useContext(UserContext);

  const handleSignUp = async () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        var user = userCredentials.user;
        console.log("User email: ", user.email);
      })
      .catch((error) => alert(error.message));

    try {
      const docRef = doc(db, "users", email);

      const data = {
        coins: 0,
        currentXp: 0,
        diamonds: 0,
        displayName: "",
        email: email,
        level: 1,
        multiplier: 1,
      };

      await setDoc(docRef, data);
      console.log("Document written with ID: ", email);

      await setUser(data);

      await navigation.navigate("homepage");

      console.log(user);
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
          <TextInput
            style={styles.inputFields}
            onChangeText={onChangeDisplayName}
            value={displayName}
            placeholder="Display Name"
          />
          <TextInput
            style={styles.inputFields}
            onChangeText={onChangeEmail}
            placeholder="Email"
            value={email}
          />
          <TextInput
            style={styles.inputFields}
            onChangeText={onChangePassword}
            value={password}
            placeholder="Password"
            secureTextEntry
          />
          <Pressable onPress={handleSignUp}>
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
    marginTop: 50,
    width: "100%",
    backgroundColor: "white",
    height: "10%",
  },
  inputFieldsContainer: {
    marginTop: 50,
  },
  submit: {
    width: "100%",
    height: "40%",
    resizeMode: "contain",
    top: 50,
  },
});
