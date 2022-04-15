import { StyleSheet, View, Text, Image } from "react-native";
import { useFonts } from "expo-font";
import { getFirestore, updateDoc, doc } from "firebase/firestore";
import { useContext } from "react";
import { UserContext } from "../UserContext";

function Topbar() {
  const { user, setUser } = useContext(UserContext);
  const [loaded] = useFonts({
    RetroGaming: require(".././assets/fonts/RetroGaming-Regular.ttf"),
  });

  if (!loaded) return null;

  const db = getFirestore();

  // Level XP calculations
  const xpToNextLevel = user["level"] * 100 * user["multiplier"];
  const level =
    user["currentXp"] === 0 ? 1 : Math.floor(xpToNextLevel / user["currentXp"]);
  updateDoc(doc(db, "users", user["email"]), {
    level: level,
  });
  // setUser({
  //   coins: user["coins"],
  //   currentXp: user["currentXp"],
  //   diamonds: user["diamonds"],
  //   displayName: user["displayName"],
  //   email: user["email"],
  //   level: level,
  //   multiplier: user["multiplier"],
  //   questsToDo: user["questsToDo"],
  //   questsDone: user["questsDone"],
  // });
  return (
    <View style={styles.header}>
      <View style={styles.levels}>
        <View style={styles.level}>
          <Text style={styles.levelText}>{user["level"]}</Text>
        </View>
        <View style={styles.progress}>
          <Text style={styles.progressText}>
            {user["currentXp"]}/{xpToNextLevel}
          </Text>
        </View>
      </View>
      <View style={styles.diamonds}>
        <Image
          style={styles.icon}
          resizeMode={"contain"}
          source={require(".././assets/ruby.png")}
        />
        <Text style={styles.iconText}>{user["diamonds"]}</Text>
      </View>
      <View style={styles.diamonds}>
        <Image
          style={styles.icon}
          resizeMode={"contain"}
          source={require(".././assets/coin.png")}
        />
        <Text style={styles.iconText}>{user["coins"]}</Text>
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
    padding: 0,
    width: 40,
    height: 40,
    textAlign: "center",
    marginVertical: "auto",
    fontFamily: "RetroGaming",
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
    padding: 0,
    fontSize: 15,
    fontFamily: "RetroGaming",
  },
  icon: {
    width: 30,
    height: 30,
  },
  iconText: {
    color: "white",
    fontFamily: "RetroGaming",
  },
});

export default Topbar;
