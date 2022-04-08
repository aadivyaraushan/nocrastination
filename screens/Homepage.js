import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Image,
} from "react-native";
import { useContext } from "react";
import Topbar from ".././components/Topbar";
import { UserContext } from "../UserContext";
import BottomBar from "../components/BottomBar";

function Homepage({ navigation }) {
  const { user, setUser } = useContext(UserContext);
  // console.log(message);

  const handleBattle = () => {
    navigation.navigate("quests");
    console.log("Navigating to quests");
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("/home/aadivyaraushan/Documents/GitHub/nocrastination/assets/homepageBG.png")}
        style={styles.bg}
      >
        <Topbar />
        <BottomBar />

        <Pressable onPress={handleBattle} style={styles.battleButton}>
          <Image
            source={require(".././assets/buttons/battleButton.png")}
            style={styles.battleImage}
          />
        </Pressable>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  battleButton: {
    width: "50%",
    alignSelf: "center",
    top: 350,
    position: "relative",
  },
  bg: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  container: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  battleImage: {
    resizeMode: "contain",
    width: "100%",
    alignSelf: "center",
  },
});

export default Homepage;
