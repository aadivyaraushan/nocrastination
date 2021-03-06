import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import Topbar from "../components/Topbar";
import BottomBar from "../components/BottomBar";
import { useFonts } from "expo-font";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  QuerySnapshot,
} from "@firebase/firestore";
import { useContext, useEffect } from "react";
import { auth, db } from "../firebase";
import { OrganisationContext } from "../OrganisationContext";
import { Audio } from "expo-av";

const Organisations = ({ navigation }) => {
  const [] = useFonts({
    RetroGaming: require("../assets/fonts/RetroGaming-Regular.ttf"),
    InkyThinPixels: require("../assets/fonts/InkyThinPixels-Regular.ttf"),
    PlayMeGames: require("../assets/fonts/Playmegames-Regular.ttf"),
  });
  const [organisationsJSX, setOrganisationsJSX] = useState();
  const { organisation, setOrganisation } = useContext(OrganisationContext);
  let organisations = [];
  const [sound, setSound] = useState();
  async function playTap() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sfx/tap1.mp3")
    );
    setSound(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    getDocs(collection(db, "organisations"))
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          organisations.push(doc.data());
        });
      })
      .then(() => {
        setOrganisationsJSX(
          <View style={styles.organisationsContainer}>
            {organisations.map((organisation, index) => {
              return (
                <Pressable
                  onPress={() => {
                    playTap();
                    navigation.navigate("organisation");
                    setOrganisation(organisation);
                  }}
                  key={index}
                  android_disableSound={true}
                >
                  <ImageBackground
                    source={require("../assets/backgrounds/panels/organisationBG.png")}
                    style={styles.organisationBackground}
                    key={index}
                  >
                    <Text style={styles.organisationName}>
                      {organisation["name"]}
                    </Text>
                    <Text style={styles.organisationDetails}>
                      Members: {organisation["members"].length}
                    </Text>
                    <Text style={styles.organisationDetails}>
                      Level: {organisation["level"]}
                    </Text>
                    <Text style={styles.organisationAwardText}>
                      {organisation["awards"]}
                    </Text>
                    <Image
                      source={require("../assets/icons/trophy.png")}
                      style={styles.organisationAwardImage}
                    />
                  </ImageBackground>
                </Pressable>
              );
            })}
          </View>
        );
      });
  }, []);

  return (
    <View>
      <ImageBackground
        source={require("../assets/backgrounds/background.png")}
        style={styles.bg}
      >
        <Topbar />
        <View style={styles.banner}>
          <Text style={styles.bannerText}>ORGANISATIONS</Text>
        </View>
        <View style={styles.organisationsContainer}>{organisationsJSX}</View>
        <BottomBar />
      </ImageBackground>
    </View>
  );
};

export default Organisations;

const styles = StyleSheet.create({
  bg: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  banner: {
    marginTop: 50,
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
  organisationBackground: {
    width: 320,
    height: 105,
    resizeMode: "contain",
    margin: 20,
    padding: 10,
  },
  organisationName: {
    fontSize: 45,
    fontFamily: "PlayMeGames",
    color: "white",
    textAlign: "center",
  },
  organisationDetails: {
    fontSize: 25,
    fontFamily: "PlayMeGames",
    color: "white",
    textAlign: "left",
  },
  organisationsContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  organisationAwardText: {
    fontSize: 40,
    fontFamily: "PlayMeGames",
    color: "white",
    textAlign: "right",
    zIndex: 2,
    position: "absolute",
    top: 60,
    left: 240,
  },
  organisationAwardImage: {
    position: "absolute",
    zIndex: 2,
    height: 30,
    width: 30,
    top: 62,
    left: 210,
  },
});
