import {
  View,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
  Pressable,
  Animated,
  LogBox,
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

function Quest({ navigation }) {
  const { user, setUser } = useContext(UserContext);
  const { quest, setQuest } = useContext(QuestContext);
  const [loaded] = useFonts({
    RetroGaming: require("../assets/fonts/RetroGaming-Regular.ttf"),
  });

  const percentComplete = user["questsDone"] * 50 + "%";
  const db = getFirestore();

  const q = query(collection(db, "tasks"), where("owner", "==", user["email"]));

  const quests = [];

  const [arrOfQuestsJSX, setArrOfQuestsJSX] = useState();

  useEffect(() => {
    console.log("Use effect just ran!");
    getDocs(q)
      .then((querySnapshot) =>
        querySnapshot.forEach((doc) => {
          quests.push(doc.data());
          // console.log(quests);
        })
      )
      .then(() => {
        setArrOfQuestsJSX(
          <View style={{}}>
            {quests.map((questFromArr, index) => (
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  alignSelf: index % 2 === 0 ? "flex-start" : "flex-end",
                  maxHeight: "25%",
                }}
                key={index}
              >
                <Pressable
                  onPress={() => {
                    setQuest(questFromArr);
                    // alert("Quest navigating to...\n" + quest["title"]);
                    navigation.navigate("questPage");
                  }}
                >
                  <Text key={index} style={styles.questText}>
                    {questFromArr["title"]}
                  </Text>

                  <Image
                    source={require("../assets/buildingIcon.png")}
                    style={styles.questBuilding}
                  />
                </Pressable>
              </View>
            ))}
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
        <Image
          source={require("../assets/swordProgressBar.png")}
          style={styles.sword}
        />
        {arrOfQuestsJSX}

        <View
          style={{
            width: 50,
            flexDirection: "column",
            height: "100%",
            backgroundColor: "white",
            alignSelf: "center",
            justifyContent: "center",
            position: "absolute",
          }}
        >
          <View
            style={{
              width: 50,
              flexDirection: "column",
              justifyContent: "flex-start",
              height: percentComplete,
              backgroundColor: "#3DDF58",
              alignSelf: "center",
              justifyContent: "center",
              top: 310,
              paddingLeft: 10,
              paddingRight: 10,
            }}
          />
        </View>
        <Image
          style={styles.banner}
          source={require("../assets/questsBanner.png")}
        />

        <Topbar style={styles.topbar} />
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
  },
  banner: {
    width: "100%",
    resizeMode: "contain",
    position: "absolute",
    top: -5,
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
  },
  topbar: {
    zIndex: 2,
    position: "absolute",
    top: 0,
  },
  questText: {
    fontSize: 15,
    textAlign: "center",
    alignSelf: "center",
    width: "100%",
    color: "white",
    fontFamily: "RetroGaming",

    // if i is even then it should be to the right else to the left
  },
  questBuilding: {
    height: "90%",
    resizeMode: "contain",
  },
});

export default Quest;
LogBox.ignoreLogs(["Setting a timer for a long period of time"]);
