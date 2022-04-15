import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { useContext, useState } from "react";
import { QuestContext } from "../QuestContext";
import { useFonts } from "expo-font";
import Topbar from "../components/Topbar";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import BottomBar from "../components/BottomBar";
import { NavigationContainer } from "@react-navigation/native";

const QuestPage = ({ route, navigation }) => {
  const rewardData = route.params;
  console.log(rewardData);
  const { quest, setQuest } = useContext(QuestContext);

  const [duration, setDuration] = useState(0);

  const [loaded] = useFonts({
    RetroGaming: require("../assets/fonts/RetroGaming-Regular.ttf"),
  });

  let rewardsJSX = (
    <>
      <Text style={styles.paragraphText}>
        {rewardData[quest["difficulty"]]["xp"]}xp
      </Text>
      <Text style={styles.paragraphText}>
        {rewardData[quest["difficulty"]]["coins"]} coins
      </Text>
    </>
  );

  // switch (quest["difficulty"]) {
  //   case "easy":
  //     rewardsJSX = (
  //       <>
  //         <Text style={styles.paragraphText}>10xp</Text>
  //         <Text style={styles.paragraphText}>5 coins</Text>
  //       </>
  //     );
  //     break;
  //   case "medium":
  //     rewardsJSX = (
  //       <>
  //         <Text style={styles.paragraphText}>20xp</Text>
  //         <Text style={styles.paragraphText}>10 coins</Text>
  //       </>
  //     );
  //     break;
  //   case "hard":
  //     rewardsJSX = (
  //       <>
  //         <Text style={styles.paragraphText}>40xp</Text>
  //         <Text style={styles.paragraphText}>20 coins</Text>
  //       </>
  //     );
  //     break;
  // }

  return (
    <View>
      <ImageBackground
        source={require("../assets/background.png")}
        style={styles.bg}
      >
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{quest["title"]}</Text>
        </View>
        <Topbar />
        <ImageBackground
          source={require("../assets/mediumPanel.png")}
          style={styles.sectionBG}
        >
          <Text style={styles.paragraphText}>Rewards: </Text>
          {rewardsJSX}
        </ImageBackground>
        <ImageBackground
          source={require("../assets/mediumPanel.png")}
          style={styles.sectionBG}
        >
          <Text style={styles.paragraphText}>Duration: </Text>
          <MultiSlider
            sliderLength={250}
            min={0}
            max={95}
            step={5}
            onValuesChange={(values) => {
              setDuration(...values);
              const [temp] = values;
              setQuest({
                difficulty: quest["difficulty"],
                owner: quest["owner"],
                subTasks: quest["subTasks"],
                title: quest["title"],
                duration: temp * 60,
              });
            }}
          />
          <Text style={styles.paragraphText}>{duration} mins</Text>
        </ImageBackground>
        <Pressable
          style={{ width: "20%", height: "20%", left: 150, bottom: 250 }}
          onPress={() => {
            if (duration != 0) {
              navigation.navigate("activeQuestPage");
            } else alert("Duraton cannot be 0!");
          }}
        >
          <Image
            source={require("../assets/playButton.png")}
            style={styles.playButton}
          />
        </Pressable>
        <BottomBar />
      </ImageBackground>
    </View>
  );
};

export default QuestPage;

const styles = StyleSheet.create({
  bg: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  banner: {
    width: "100%",
    height: "7%",
    backgroundColor: "#E92720",
    top: 50,
  },
  bannerText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "RetroGaming",
    fontSize: 30,
  },
  paragraphText: {
    fontFamily: "RetroGaming",
    color: "white",
    fontSize: 30,
  },
  sectionBG: {
    width: "100%",
    height: "auto",
    resizeMode: "contain",
    padding: 50,
    top: 70,
    marginBottom: 20,
  },
  playButton: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
