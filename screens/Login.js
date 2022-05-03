import {
  TextInput,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Pressable,
} from "react-native";
import { useContext, useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { UserContext } from "../UserContext.js";
import { auth, db } from "../firebase";

let userCred = null;

function Login({ navigation }) {
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const { user, setUser } = useContext(UserContext);

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
      navigation.navigate("homepage");
    } else console.log("No such document!");
  };

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
          <TextInput
            style={styles.inputFields}
            onChangeText={onChangeEmail}
            value={email}
            placeholder="Email"
          />
          <TextInput
            style={styles.inputFields}
            onChangeText={onChangePassword}
            value={password}
            placeholder="Password"
            secureTextEntry
          />
          <Pressable onPress={handleLogin}>
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
