import { StyleSheet, View, Text, Image } from "react-native";
import react from "react";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

function BottomBar() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.navigate("shop")}>
        <Image
          source={require("../assets/shopIcon.png")}
          style={styles.icon}
        ></Image>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("quests")}>
        <Image
          source={require("../assets/questsIcon.png")}
          style={styles.icon}
        ></Image>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("addtask")}>
        <Image
          source={require("../assets/addTaskIcon.png")}
          style={styles.icon}
        ></Image>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("organisations")}>
        <Image
          source={require("../assets/socialIcon.png")}
          style={styles.icon}
        ></Image>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("settings")}>
        <Image
          source={require("../assets/settingsIcon.png")}
          style={styles.icon}
        ></Image>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    resizeMode: "contain",
    width: 80,
    height: 80,
  },
  container: {
    flexDirection: "row",
    backgroundColor: "#2D2D2D",
    width: "100%",
    height: 80,
    justifyContent: "space-around",
    flex: 1,
    position: "absolute",
    bottom: 0,
  },
});

export default BottomBar;
