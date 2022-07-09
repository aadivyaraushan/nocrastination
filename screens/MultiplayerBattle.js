import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Pressable,
} from "react-native";
import React, { useEffect } from "react";
import { useContext, useState } from "react/cjs/react.development";
import { QuestContext } from "../QuestContext";
import { GameContext } from "../GameContext";
import HealthBar from "../components/HealthBar";
import { setButtonStyleAsync } from "expo-navigation-bar";
import { UserContext } from "../UserContext";
import { deleteDoc, doc, updateDoc } from "@firebase/firestore";
import { db, rtdb } from "../firebase";
import { Audio } from "expo-av";
import { useFonts } from "expo-font";
import { child, get, onValue, ref, remove, update } from "firebase/database";

const MultiplayerBattle = ({ route, navigation }) => {
  // Declaration of necessary context
  const { user, setUser } = useContext(UserContext);
  const { quest, setQuest } = useContext(QuestContext);
  const { game, setGame } = useContext(GameContext);

  // Declaration of necessary data
  const rewardData = route.params;
  const [count, setCount] = useState(80);
  const [attackPressed, setAttackPressed] = useState(false);
  const [sound, setSound] = useState();
  const [] = useFonts({
    RetroGaming: require("../assets/fonts/RetroGaming-Regular.ttf"),
    InkyThinPixels: require("../assets/fonts/InkyThinPixels-Regular.ttf"),
    PlayMeGames: require("../assets/fonts/Playmegames-Regular.ttf"),
  });

  // Sound functions
  async function playDamaged() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sfx/damaged.mp3")
    );
    setSound(sound);
    await sound.playAsync();
  }

  async function playVictory() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sfx/victory.mp3")
    );
    setSound(sound);
    await sound.playAsync();
  }

  async function playDefeat() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sfx/defeat.mp3")
    );
    setSound(sound);
    await sound.playAsync();
  }

  async function playAttack() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sfx/attack.mp3")
    );
    setSound(sound);
    await sound.playAsync();
  }

  function playerWin() {
    alert("You won!");
    playVictory();
    updateDoc(doc(db, "users", user["email"]), {
      coins: user["coins"] + rewardData[quest["difficulty"]]["coins"],
      currentXp: user["currentXp"] + rewardData[quest["difficulty"]]["xp"],
    })
      .then(() => {
        console.log("Document updated");
        setUser({
          activeQuest: user["activeQuest"],
          avatar: user["avatar"],
          coins: user["coins"] + rewardData[quest["difficulty"]]["coins"],
          currentXp: user["currentXp"] + rewardData[quest["difficulty"]]["xp"],
          diamonds: user["diamonds"],
          displayName: user["displayName"],
          email: user["email"],
          emotes: user["emotes"],
          items: user["items"],
          level: user["level"],
          multiplier: user["multiplier"],
          questsDone: user["questsDone"],
          tasks: user["tasks"],
        });
      })
      .then(() => {
        console.log("User context updated");
        navigation.navigate("homepage");
      });
  }

  function playerLose() {
    alert("You lost!");
    navigation.navigate("homepage");
  }

  // Declaring isPlayerOne

  // Declaring damage for player
  let damage = 0;
  get(child(ref(rtdb), `games/${game}/damages`)).then((snapshot) => {
    if (snapshot.exists()) {
      if (isPlayerOne) {
        damage = snapshot.val()["player1"];
      } else {
        damage = snapshot.val()["player2"];
      }
    }
  });

  // Declaring state
  const [subTasks, setSubTasks] = useState([]);
  const [health1, setHealth1] = useState();
  const [health2, setHealth2] = useState();
  const [player1Avatar, setPlayer1Avatar] = useState();
  const [player2Avatar, setPlayer2Avatar] = useState();
  const [displayName1, setDisplayName1] = useState();
  const [displayName2, setDisplayName2] = useState();
  const [subTasks1, setSubTasks1] = useState(<></>);
  const [subTasks2, setSubTasks2] = useState(<></>);
  const [isPlayerOne, setIsPlayerOne] = useState();
  const [lowerHealthBar, setLowerHealthBar] = useState(
    <HealthBar health={health1} isLower={true} />
  );
  const [upperHealthBar, setUpperHealthBar] = useState(
    <HealthBar health={health2} isLower={false} />
  );
  useEffect(() => {
    // Declaring isPlayerOne
    get(child(ref(rtdb), `games/${game}/emails`)).then((snapshot) => {
      if (snapshot.exists()) {
        setIsPlayerOne(snapshot.val()["player1"] === user["email"]);
        // console.log(isPlayerOne);
      }
    });

    // Getting subTasks one time
    get(child(ref(rtdb), `games/${game}/subTasks`)).then((snapshot) => {
      if (isPlayerOne) setSubTasks(snapshot.val()["player1"]);
      else setSubTasks(snapshot.val()["player2"]);
      console.log("Extracted subTasks");
      // Attaching listener to subTasks
      onValue(ref(rtdb, `games/${game}/subTasks`), (snapshot) => {
        if (isPlayerOne) setSubTasks(snapshot.val()["player1"]);
        else setSubTasks(snapshot.val()["player2"]);
      });
    });
    // Getting healths one time
    get(child(ref(rtdb), `games/${game}/healths`)).then((snapshot) => {
      const one = snapshot.val()["player1"];
      const two = snapshot.val()["player2"];
      if (isPlayerOne) {
        setHealth1(one);
        setHealth2(two);
      } else {
        setHealth1(two);
        setHealth2(one);
      }
      console.log("Extracted healths");
      // Attaching listener to healths
      onValue(ref(rtdb, `games/${game}/healths`), (snapshot) => {
        const one = snapshot.val()["player1"];
        const two = snapshot.val()["player2"];
        if (isPlayerOne) {
          setHealth1(one);
          setHealth2(two);
        } else {
          setHealth1(two);
          setHealth2(one);
        }
      });
    });

    // Getting avatars
    get(child(ref(rtdb), `games/${game}/avatars`)).then((snapshot) => {
      if (snapshot.exists()) {
        if (isPlayerOne) {
          switch (snapshot.val()["player1"]) {
            case "superhero":
              setPlayer1Avatar(require("../assets/superhero.png"));
              break;
            case "wizard":
              setPlayer1Avatar(require("../assets/wizard.png"));
              break;
          }
          switch (snapshot.val()["player2"]) {
            case "superhero":
              setPlayer2Avatar(require("../assets/superhero.png"));
              break;
            case "wizard":
              setPlayer2Avatar(require("../assets/wizard.png"));
              break;
          }
        } else {
          switch (snapshot.val()["player2"]) {
            case "superhero":
              setPlayer1Avatar(require("../assets/superhero.png"));
              break;
            case "wizard":
              setPlayer1Avatar(require("../assets/wizard.png"));
              break;
          }
          switch (snapshot.val()["player1"]) {
            case "superhero":
              setPlayer2Avatar(require("../assets/superhero.png"));
              break;
            case "wizard":
              setPlayer2Avatar(require("../assets/wizard.png"));
              break;
          }
        }
      }
    });

    // Getting displayName
    get(child(ref(rtdb), `games/${game}/names`)).then((snapshot) => {
      if (snapshot.exists()) {
        if (isPlayerOne) {
          setDisplayName1(snapshot.val()["player1"]);
          setDisplayName2(snapshot.val()["player2"]);
        } else {
          setDisplayName1(snapshot.val()["player2"]);
          setDisplayName2(snapshot.val()["player1"]);
        }
      }
    });

    console.log("Attached listeners for subTasks and healths");
  }, []);

  useEffect(() => {
    console.log("Healths were changed: ", health1, health2);
    if (health1 <= 0) {
      playerLose();
    } else if (health2 <= 0) {
      playerWin();
    }
    setUpperHealthBar(<HealthBar health={health2} isLower={false} />);
    setLowerHealthBar(<HealthBar health={health1} isLower={true} />);
  }, [health1, health2]);

  useEffect(() => {
    console.log(health2);
    if (isPlayerOne && health2) {
      if (subTasks) {
        setSubTasks1(
          <>
            {subTasks.map((subTask, index) => {
              return (
                <Pressable
                  onPress={() => {
                    console.log("Pressed");
                    if (count < 60) {
                      alert("Wait 1 min before checking off another sub-quest");
                    } else {
                      if (health2) {
                        let subTasksTemp = subTasks;
                        subTasksTemp.splice(subTasksTemp.indexOf(subTask), 1);
                        const updates = {};
                        updates[`games/${game}/subTasks/player1`] =
                          subTasksTemp;
                        updates[`games/${game}/healths/player2`] =
                          health2 - damage;
                        update(ref(rtdb), updates).then(() => {
                          setAttackPressed(true);
                          playAttack();
                          // setHealth2(health2 - damage);
                        });
                      }
                    }
                  }}
                  key={index}
                  style={styles.textContainer}
                  disabled={!isPlayerOne}
                  android_disableSound={true}
                >
                  <Text style={styles.text} key={index}>
                    □{subTask}
                  </Text>
                </Pressable>
              );
            })}
          </>
        );
      }
      setSubTasks2(<Text style={styles.text}>...</Text>);
    } else if (health2) {
      console.log(health2);
      if (subTasks) {
        setSubTasks2(
          <>
            {subTasks.map((subTask, index) => {
              return (
                <Pressable
                  onPress={() => {
                    console.log("Pressed");
                    if (count < 60) {
                      alert("Wait 1 min before checking off another sub-quest");
                    } else {
                      let subTasksTemp = subTasks;
                      subTasksTemp.splice(subTasksTemp.indexOf(subTask), 1);
                      const updates = {};
                      updates[`games/${game}/subTasks/player2`] = subTasksTemp;
                      console.log("Health2: " + health2);
                      console.log("Damage: " + damage);
                      updates[`games/${game}/healths/player1`] =
                        health2 - damage;
                      // console.log(updates);

                      update(ref(rtdb), updates).then(() => {
                        setAttackPressed(true);
                        playAttack();
                        // setHealth1(health1 - damage);
                      });
                    }
                  }}
                  key={index}
                  style={styles.textContainer}
                  disabled={isPlayerOne}
                  android_disableSound={true}
                >
                  <Text style={styles.text} key={index}>
                    □{subTask}
                  </Text>
                </Pressable>
              );
            })}
          </>
        );
      }
      setSubTasks1(<Text style={styles.text}>...</Text>);
    }
  }, [subTasks]);

  return (
    <View>
      <ImageBackground
        source={require("../assets/background.png")}
        style={styles.bg}
      >
        <View style={styles.panelsContainer}>
          <ImageBackground style={styles.subTasksPanel}>
            <View style={styles.subTasksContainer}>
              <Text style={styles.name}>{displayName1}</Text>
              {subTasks1}
            </View>
          </ImageBackground>
          <ImageBackground style={styles.subTasksPanel}>
            <View style={styles.subTasksContainer}>
              <Text style={styles.name}>{displayName2}</Text>
              {subTasks2}
            </View>
          </ImageBackground>
        </View>
        {upperHealthBar}
        <Image style={styles.lowerAvatar} source={player1Avatar} />
        <Image style={styles.upperAvatar} source={player2Avatar} />
        {lowerHealthBar}
      </ImageBackground>
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
    flexDirection: "column-reverse",
  },
  subTasksPanel: {
    backgroundColor: "#9EDBD8",
    width: 200,
    height: 250,
  },
  subTasksContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  panelsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  text: {
    fontSize: 25,
    color: "white",
    fontFamily: "PlayMeGames",
    top: 0,
    left: 0,
    position: "relative",
  },
  textContainer: {
    flex: 1,
    flexWrap: "nowrap",
    // marginLeft: 30,
    // marginTop: 5,
    // marginBottom: 5,
  },
  name: {
    fontSize: 30,
    color: "white",
    fontFamily: "PlayMeGames",
    // marginLeft: 30,
    // marginTop: 5,
    marginBottom: 10,
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
  },
  lowerAvatar: {
    width: 170,
    height: 170,
    marginLeft: 10,
    marginBottom: 40,
    resizeMode: "contain",
  },
  upperAvatar: {
    width: 170,
    height: 170,
    position: "absolute",
    top: 80,
    right: 20,
    transform: [{ scaleX: -1 }],
    resizeMode: "contain",
  },
});
