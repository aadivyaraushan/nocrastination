import { StyleSheet, View, Text, Image } from "react-native";
import { useFonts } from "expo-font";
import { getFirestore, updateDoc, doc, onSnapshot } from "firebase/firestore";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext";

function Topbar() {
  const { user, setUser } = useContext(UserContext);
  const db = getFirestore();
  const currentLevel = Math.floor(0.07 * Math.sqrt(user["currentXp"])) === 0 ? 1 : Math.floor(0.07 * Math.sqrt(user["currentXp"]));
  const [xpAtNextLevel, setXpAtNextLevel] = useState(
      Math.floor(((currentLevel + 1) / 0.07) ** 2)
  );
  const [currentLevelXp, setCurrentLevelXp] = useState(
      Math.floor((currentLevel / 0.07) ** 2)
  );
  const [level, setLevel] = useState(currentLevel)
  useEffect(() => {
    if(level === user.level)
    {
      console.log("Same level as before");
    }
    else {
      console.log("Level up!");
      updateDoc(doc(db, "users", user["email"]), {
        level,
      }).then(() => {
        console.log("updateDoc for level");
        setUser({
          activeQuest: user["activeQuest"],
          avatar: user["avatar"],
          coins: user["coins"],
          currentXp: user["currentXp"] === 0 ? 204 : user.currentXp,
          diamonds: user["diamonds"],
          displayName: user["displayName"],
          email: user["email"],
          emotes: user["emotes"],
          items: user["items"],
          level: currentLevel,
          multiplier: user["multiplier"],
          questsDone: user["questsDone"],
          tasks: user["tasks"],
        });
      });
    }
  }, []);

  const [diamondsLocal, setDiamondsLocal] = useState(
    <Text style={styles.iconText} adjustsFontSizeToFit={true} numberOfLines={1}>{user["diamonds"]}</Text>
  );
  const [coinsLocal, setCoinsLocal] = useState(
    <Text style={styles.iconText} adjustsFontSizeToFit={true} numberOfLines={1}>{user["coins"]}</Text>
  );
  const [progressBar, setProgressBar] = useState(
    <View style={styles.progress}>
      <Text style={styles.progressText} adjustsFontSizeToFit={true} numberOfLines={1}>
        {user["currentXp"] - currentLevelXp}/{xpAtNextLevel - currentLevelXp}
      </Text>
    </View>
  );
  const [loaded] = useFonts({
    RetroGaming: require("../assets/fonts/RetroGaming-Regular.ttf"),
    InkyThinPixels: require("../assets/fonts/InkyThinPixels-Regular.ttf"),
    PlayMeGames: require("../assets/fonts/Playmegames-Regular.ttf"),
  });

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setXpAtNextLevel(Math.floor(((level + 1) / 0.07) ** 2));
      setCurrentLevelXp(Math.floor((level / 0.07) ** 2));
      setCoinsLocal(<Text style={styles.iconText} adjustsFontSizeToFit={true} numberOfLines={1}>{user["coins"]}</Text>);
      setDiamondsLocal(<Text style={styles.iconText} adjustsFontSizeToFit={true} numberOfLines={1}>{user["diamonds"]}</Text>);
      setProgressBar(
        <View style={styles.progress}>
          <Text style={styles.progressText} adjustsFontSizeToFit={true} numberOfLines={1}>
            {user["currentXp"] - Math.floor((user["level"] / 0.07) ** 2)}/
            {Math.floor(((user["level"] + 1) / 0.07) ** 2) -
              Math.floor((user["level"] / 0.07) ** 2)}
          </Text>
        </View>
      );
      // updateDoc(doc(db, "users", user["email"]), {
      //   level,
      // }).then(() => {
      //   console.log("updateDoc for level");
      //   setUser({
      //     activeQuest: user["activeQuest"],
      //     avatar: user["avatar"],
      //     coins: user["coins"],
      //     currentXp: user["currentXp"],
      //     diamonds: user["diamonds"],
      //     displayName: user["displayName"],
      //     email: user["email"],
      //     emotes: user["emotes"],
      //     items: user["items"],
      //     level: currentLevel,
      //     multiplier: user["multiplier"],
      //     questsDone: user["questsDone"],
      //     tasks: user["tasks"],
      //   });
      // });
    }

    return () => {
      mounted = false;
    };
  }, [user]);

  return (
    <View style={styles.header}>
      <View style={styles.levels}>
        <View style={styles.level}>
          <Text style={styles.levelText} adjustsFontSizeToFit={true} numberOfLines={1}>{level}</Text>
        </View>
        {progressBar}
      </View>
      <View style={styles.diamonds}>
        <Image
          style={styles.icon}
          resizeMode={"contain"}
          source={require(".././assets/icons/diamond.png")}
        />
        {diamondsLocal}
      </View>
      <View style={styles.diamonds}>
        <Image
          style={styles.icon}
          resizeMode={"contain"}
          source={require(".././assets/icons/coin.png")}
        />
        {coinsLocal}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#1F2025",
    position: "absolute",
    zIndex: 2,
  },
  level: {
    backgroundColor: "#20A4A4",
    height: 40,
    width: 40,
    flex: 0.3,
    padding: 0,
  },
  levelText: {
    color: "white",
    fontSize: 30,
    padding: 7,
    textAlign: "center",
    marginVertical: "auto",
    fontFamily: "PlayMeGames",
  },
  levels: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    marginLeft: 15,
  },
  diamonds: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  progress: {
    flex: 0.5,
    backgroundColor: "#67CACA",
  },
  progressText: {
    color: "white",
    textAlign: "center",
    paddingTop: 1,
    margin: 3,
    fontSize: 15,
    fontFamily: "PlayMeGames",
  },
  icon: {
    width: 30,
    height: 30,
  },
  iconText: {
    color: "white",
    fontFamily: "PlayMeGames",
  },
});

export default Topbar;
