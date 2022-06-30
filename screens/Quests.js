import {
  View,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
  Pressable,
  Animated,
  LogBox,
  ScrollView,
  Dimensions,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import BottomBar from "../components/BottomBar";
import { UserContext } from "../UserContext";
import { QuestContext } from "../QuestContext";
import {
  query,
  collection,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { useFonts } from "expo-font";
import { Audio } from "expo-av";

function Quest({ navigation }) {
  const { user, setUser } = useContext(UserContext);
  const { quest, setQuest } = useContext(QuestContext);
  const [] = useFonts({
    RetroGaming: require("../assets/fonts/RetroGaming-Regular.ttf"),
    InkyThinPixels: require("../assets/fonts/InkyThinPixels-Regular.ttf"),
    PlayMeGames: require("../assets/fonts/Playmegames-Regular.ttf"),
  });
  const percentComplete = user["questsDone"] * 50 + "%";
  const db = getFirestore();
  const q = query(collection(db, "tasks"), where("owner", "==", user["email"]));
  const quests = [];
  const [arrOfQuestsJSX, setArrOfQuestsJSX] = useState();
  const [sound, setSound] = useState();
  async function playTap() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sfx/tap1.mp3")
    );
    setSound(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    getDocs(q)
      .then((querySnapshot) =>
        querySnapshot.forEach((doc) => {
          quests.push(doc.data());
        })
      )
      .then(() => {
        // setArrOfQuestsJSX(
        //   <ScrollView
        //     style={{
        //       // backgroundColor: "black",
        //       width: "100%",
        //       height: "70%",
        //     }}
        //     contentContainerStyle={{
        //       justifyContent: "center",
        //       alignItems: "center",
        //     }}
        //     horizontal={true}
        //   >
        //     {quests.map((questFromArr, index) => (
        //       <Pressable
        //         onPress={() => {
        //           setQuest(questFromArr);
        //           // alert("Quest navigating to...\n" + quest["title"]);
        //           playTap();
        //           navigation.navigate("questPage");
        //         }}
        //         android_disableSound={true}
        //       >
        //         <View
        //           style={{
        //             display: "flex",
        //             flexDirection: "column",
        //             width: "100%",
        //             height: "40%",
        //             alignSelf: "center",
        //             marginRight: 20,
        //           }}
        //         >
        //           <Text key={index} style={styles.questText}>
        //             {questFromArr["title"]}
        //           </Text>
        //           <Image
        //             source={require("../assets/buildingIcon.png")}
        //             style={styles.questBuilding}
        //           />
        //         </View>
        //       </Pressable>
        //     ))}
        //   </ScrollView>
        // );
        setArrOfQuestsJSX(
          <View style={styles.questsGridContainer}>
            <View style={styles.questGridContainer}>
              {quests.map((questFromArr, index) => {
                return (
                  <View style={styles.boxContainer} key={index}>
                    <Pressable
                      onPress={() => {
                        setQuest(questFromArr);
                        playTap();
                        navigation.navigate("questPage");
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                          height: "40%",
                          alignSelf: "center",
                          marginRight: 20,
                        }}
                      >
                        <View style={styles.textContainer}>
                          <Text key={index} style={styles.questText}>
                            {questFromArr["title"]}
                          </Text>
                        </View>
                        <Image
                          source={require("../assets/buildingIcon.png")}
                          style={styles.questBuilding}
                        />
                      </View>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </View>
        );
      })
      .catch((reason) => alert(reason));
  }, []);

  return (
    <View>
      <ImageBackground
        source={require("../assets/background.png")}
        style={styles.bg}
      >
        <Topbar style={styles.topbar} />
        <Image
          style={styles.banner}
          source={require("../assets/questsBanner.png")}
        />
        {arrOfQuestsJSX}
        <BottomBar />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    display: "flex",
    flexDirection: "column",
  },
  banner: {
    width: "100%",
    resizeMode: "contain",
    position: "absolute",
    top: -5,
    zIndex: 2,
  },
  button: {
    resizeMode: "contain",
    width: 350,
    top: 100,
    alignSelf: "center",
    marginBottom: 5,
  },
  bar: {
    width: 50,
    flexDirection: "column",
    height: "100%",
    backgroundColor: "white",
    alignSelf: "center",
    justifyContent: "center",
    top: -1100,
    position: "relative",
  },
  sword: {
    alignSelf: "center",
    resizeMode: "contain",
    width: 100,
    top: 340,
    zIndex: 1,
    position: "absolute",
  },
  topbar: {
    zIndex: 2,
    position: "absolute",
    top: 0,
  },
  questText: {
    fontSize: 13,
    textAlign: "center",
    alignSelf: "center",
    color: "white",
    fontFamily: "PlayMeGames",
    flex: 1,
    flexWrap: "wrap",
  },
  questBuilding: {
    marginTop: 10,
    height: 60,
    resizeMode: "contain",
    alignSelf: "center",
  },
  questsGridContainer: {
    flex: 1,
    top: 60,
  },
  questGridContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 2,
  },
  boxContainer: {
    margin: 2,
    width: Dimensions.get("window").width / 2 - 6,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flexDirection: "row",
  },
});

export default Quest;
LogBox.ignoreLogs(["Setting a timer for a long period of time"]);
