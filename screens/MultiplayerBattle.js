import { StyleSheet, Text, View, ImageBackground } from "react-native";
import React, { useEffect } from "react";
import { useContext } from "react/cjs/react.development";
import { QuestContext } from "../QuestContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth, realtimedb } from "../firebase";
import { ref, set } from "firebase/database";
import { UserContext } from "../UserContext";

const MultiplayerBattle = () => {
  const { user, setUser } = useContext(UserContext);
  console.log(user);
  const { quest, setQuest } = useContext(QuestContext);
  console.log(quest);

  useEffect(() => {
    let playerId;
    let playerRef;

    onAuthStateChanged(auth, (user) => {
      playerId = user.uid;
      playerRef = ref(realtimedb, "players/" + playerId);

      set(ref, {
        name: user["displayName"],
        hp: 100,
        avatar: require("../assets/coin.png"),
        subTasks: quest["subTasks"],
        difficulty: quest["difficulty"],
      });
    });
  }, []);

  return (
    <View>
      <ImageBackground
        source={require("../assets/background.png")}
        style={styles.bg}
      ></ImageBackground>
    </View>
  );
};

export default MultiplayerBattle;

const styles = StyleSheet.create({
  bg: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    display: "flex",
    alignItems: "center",
  },
});
