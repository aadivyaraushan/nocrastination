import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Image,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import Topbar from ".././components/Topbar";
import { UserContext } from "../UserContext";
import BottomBar from "../components/BottomBar";
import { Audio } from "expo-av";

function Homepage({ navigation }) {
  const { user, setUser } = useContext(UserContext);
  const [sound, setSound] = useState();

  const handleQuest = () => {
    playTap2();
    navigation.navigate("battleselect");
  };

  async function playTap2() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sfx/tap2.mp3")
    );
    setSound(sound);

    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("/home/aadivyaraushan/Documents/GitHub/nocrastination/assets/homepageBG.png")}
        style={styles.bg}
      >
        <Topbar />
        <BottomBar />

        <Pressable
          onPress={handleQuest}
          style={styles.QuestButton}
          android_disableSound={true}
        >
          <Image
            source={require(".././assets/buttons/battleButton.png")}
            style={styles.QuestImage}
          />
        </Pressable>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  QuestButton: {
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
  QuestImage: {
    resizeMode: "contain",
    width: "100%",
    alignSelf: "center",
  },
});

export default Homepage;
