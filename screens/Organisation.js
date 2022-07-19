import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { useContext } from "react";
import { OrganisationContext } from "../OrganisationContext";
import Topbar from "../components/Topbar";
import BottomBar from "../components/BottomBar";
import { useFonts } from "expo-font";

const Organisation = () => {
  const { organisation, setOrganisation } = useContext(OrganisationContext);

  const [] = useFonts({
    RetroGaming: require("../assets/fonts/RetroGaming-Regular.ttf"),
    InkyThinPixels: require("../assets/fonts/InkyThinPixels-Regular.ttf"),
    PlayMeGames: require("../assets/fonts/Playmegames-Regular.ttf"),
  });

  return (
    <View>
      <ImageBackground
        source={require("../assets/backgrounds/background.png")}
        style={styles.bg}
      >
        <Topbar />
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{organisation["name"]}</Text>
        </View>
        <View style={styles.bannerSecondary}>
          <Text style={styles.bannerTextSecondary}>Members</Text>
        </View>
        <ImageBackground
          source={require("../assets/backgrounds/panels/mediumPanel.png")}
          style={styles.panel}
        >
          <ScrollView>
            {organisation["members"].map((member, index) => {
              if (index == 0)
                return <Text style={styles.text}>{member} (leader)</Text>;
              return <Text style={styles.text}>{member}</Text>;
            })}
          </ScrollView>
        </ImageBackground>
        <View style={styles.bannerSecondary}>
          <Text style={styles.bannerTextSecondary}>Requirements</Text>
        </View>
        <ImageBackground
          source={require("../assets/backgrounds/panels/mediumPanel.png")}
          style={styles.panel}
        >
          <Text style={styles.text}>
            Minimum level: {organisation["requirements"]["minLevel"]}
          </Text>
          <Text style={styles.text}>
            Minimum coins: {organisation["requirements"]["minCoins"]} coins
          </Text>
        </ImageBackground>
        <BottomBar />
      </ImageBackground>
    </View>
  );
};

export default Organisation;

const styles = StyleSheet.create({
  bg: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    display: "flex",
    alignItems: "center",
  },
  banner: {
    marginTop: 50,
    backgroundColor: "#DD4141",
    width: "100%",
  },
  bannerSecondary: {
    backgroundColor: "#DD4141",
    width: "100%",
  },
  bannerTextSecondary: {
    fontSize: 50,
    fontFamily: "PlayMeGames",
    color: "white",
    textAlign: "center",
  },
  bannerText: {
    fontSize: 60,
    fontFamily: "PlayMeGames",
    color: "white",
    textAlign: "center",
  },
  panel: {
    width: 250,
    height: 200,
    margin: 5,
    padding: 15,
  },
  text: {
    fontSize: 20,
    fontFamily: "PlayMeGames",
    color: "white",
    textAlign: "center",
  },
});
