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
import { onAuthStateChanged } from "firebase/auth";
import { GameContext } from "../GameContext";
import HealthBar from "../components/HealthBar";
import { setButtonStyleAsync } from "expo-navigation-bar";
import { UserContext } from "../UserContext";
import { deleteDoc, doc, updateDoc } from "@firebase/firestore";
import { db } from "../firebase";
import { Audio } from "expo-av";
import { Sound } from "expo-av/build/Audio";

const MultiplayerBattle = ({ route, navigation }) => {
  const rewardData = route.params;
  const { game, setGame } = useContext(GameContext);
  const { user, setUser } = useContext(UserContext);
  const { quest, setQuest } = useContext(QuestContext);
  const [player1Health, setPlayer1Health] = useState();
  const [player2Health, setPlayer2Health] = useState();
  const [player1Count, setPlayer1Count] = useState(80);
  const [player2Count, setPlayer2Count] = useState(80);
  const [player1AttackPressed, setPlayer1AttackPressed] = useState(false);
  const [player2AttackPressed, setPlayer2AttackPressed] = useState(false);
  const [subTasksP1, setSubTasksP1] = useState(
    game["player1"]["activeQuest"]["subTasks"]
  );
  const [subTasksP2, setSubTasksP2] = useState(
    game["player2"]["activeQuest"]["subTasks"]
  );
  const [sound, setSound] = useState();

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

  // Calculating health boost and damage boost
  let player1HealthBoost = 0;
  let player1DamageBoost = 0;
  let player1Avatar = "";
  for (const item of game["player1"]["items"]) {
    if (item["name"] == "regeneration") {
      // special regeneration stuff
    } else if (item["type"] == "offensive")
      player1DamageBoost += item["damageBoost"];
    else if (item["type"] == "deensive")
      player1HealthBoost += item["healthBoost"];
  }
  const player1DamagePerSubTask =
    100 / game["player1"]["activeQuest"]["subTasks"].length +
    player1DamageBoost;
  let player1HealthVar = 100 + player1HealthBoost;

  // Computing player 1 avatar
  switch (game["player1"]["avatar"]) {
    case "superhero":
      player1Avatar = require("../assets/superhero.png");
      break;
    case "wizard":
      player1Avatar = require("../assets/wizard.png");
      break;
  }

  // Calculating player 2's health boost and damage boost
  let player2HealthBoost = 0;
  let player2DamageBoost = 0;
  let player2Avatar = "";
  for (const item of game["player2"]["items"]) {
    if (item["name"] == "regeneration") {
      // special regeneration stuff
    } else if (item["type"] == "offensive")
      player2DamageBoost += item["damageBoost"];
    else if (item["type"] == "deensive")
      player2HealthBoost += item["healthBoost"];
  }
  const player2DamagePerSubTask =
    100 / game["player2"]["activeQuest"]["subTasks"].length +
    player2DamageBoost;
  let player2HealthVar = 100 + player2HealthBoost;

  // Computing player2 avatar
  switch (game["player2"]["avatar"]) {
    case "superhero":
      player2Avatar = require("../assets/superhero.png");
      break;
    case "wizard":
      player2Avatar = require("../assets/wizard.png");
      break;
  }

  useEffect(() => {
    setPlayer1Health(player1HealthVar);
    setPlayer2Health(player2HealthVar);
  }, []);

  useEffect(() => {
    if (player1Health <= 0) {
      if (game["player2"]["email"] == user["email"]) {
        playVictory();
      } else {
        playDefeat();
      }
      alert(game["player2"]["displayName"] + " wins!");
      updateDoc(doc(db, "users", game["player2"]["email"]), {
        coins: user["coins"] + rewardData[quest["difficulty"]]["coins"],
        currentXp: user["currentXp"] + rewardData[quest["difficulty"]]["xp"],
      })
        .then(() => {
          if (game["player2"]["email"] === user["email"]) {
            setUser({
              avatar: user["avatar"],
              coins: user["coins"] + rewardData[quest["difficulty"]]["coins"],
              currentXp:
                user["currentXp"] + rewardData[quest["difficulty"]]["xp"],
              activeQuest: user["activeQuest"],
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
          }
        })
        .then(() => {
          deleteDoc(doc(db, "games", game["id"]))
            .then(() => navigation.navigate("homepage"))
            .catch((reason) => alert(reason));
        });

      return;
    }
    if (player2Health <= 0) {
      if (game["player1"]["email"] == user["email"]) {
        playVictory();
      } else {
        playDefeat();
      }
      alert(game["player1"]["displayName"] + " wins!");
      updateDoc(doc(db, "users", game["player1"]["email"]), {
        coins: user["coins"] + rewardData[quest["difficulty"]]["coins"],
        currentXp: user["currentXp"] + rewardData[quest["difficulty"]]["xp"],
      })
        .then(() => {
          if (game["player1"]["email"] === user["email"]) {
            user["tasks"].splice(user["tasks"].indexOf(user["activeQuest"]), 1);
            setUser({
              coins: user["coins"] + rewardData[quest["difficulty"]]["coins"],
              currentXp:
                user["currentXp"] + rewardData[quest["difficulty"]]["xp"],
              activeQuest: user["activeQuest"],
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
          }
        })
        .then(() => {
          deleteDoc(doc(db, "games", game["id"]))
            .then(() => navigation.navigate("homepage"))
            .catch((reason) => alert(reason));
        });

      return;
    }
  }, [player1Health, player2Health]);

  setTimeout(() => {
    if (player1AttackPressed) {
      setPlayer1Count(0);
      setPlayer1AttackPressed(false);
    }
    if (player2AttackPressed) {
      setPlayer2Count(0);
      setPlayer2AttackPressed(false);
    }
    setPlayer1Count(player1Count + 1);
    setPlayer2Count(player2Count + 1);
  }, 1000);

  return (
    <View>
      <ImageBackground
        source={require("../assets/background.png")}
        style={styles.bg}
      >
        <View style={styles.panelsContainer}>
          <ImageBackground style={styles.subTasksPanel}>
            <View style={styles.subTasksContainer}>
              <Text style={styles.name}>{game["player1"]["displayName"]}</Text>
              {subTasksP1.map((subTask, index) => {
                return (
                  <Pressable
                    onPress={() => {
                      if (player1Count < 60) {
                        alert(
                          "Wait 1 min before checking off another sub-quest"
                        );
                      } else {
                        if (game["player1"]["email"] === user["email"]) {
                          playAttack();
                          user["activeQuest"]["subTasks"].splice(
                            user["activeQuest"]["subTasks"].indexOf(subTask),
                            1
                          );
                          console.log(
                            "removed ",
                            subTask,
                            " from ",
                            user["activeQuest"]["subTasks"]
                          );
                          setUser({
                            activeQuest: user["activeQuest"],
                            avatar: user["avatar"],
                            coins: user["coins"],
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

                          updateDoc(doc(db, "users", user["email"]), {
                            activeQuest: user["activeQuest"],
                          });
                        } else {
                          playDamaged();
                          game["player1"]["activeQuest"]["subTasks"].splice(
                            game["player1"]["activeQuest"]["subTasks"].indexOf(
                              subTask
                            ),
                            1
                          );
                          updateDoc(
                            doc(db, "users", game["player1"]["email"]),
                            {
                              activeQuest:
                                game["player1"]["email"]["activeQuest"],
                            }
                          );
                        }
                        setPlayer2Health(
                          player2Health - player1DamagePerSubTask
                        );
                        setPlayer1AttackPressed(true);
                        subTasksP1.splice(subTasksP1.indexOf(subTask), 1);
                        setSubTasksP1(subTasksP1);
                      }
                    }}
                    key={index}
                    style={styles.textContainer}
                    disabled={game["player1"]["email"] != user["email"]}
                    android_disableSound={true}
                  >
                    <Text style={styles.text} key={index}>
                      □{subTask}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ImageBackground>
          <ImageBackground style={styles.subTasksPanel}>
            <View style={styles.subTasksContainer}>
              <Text style={styles.name}>{game["player2"]["displayName"]}</Text>
              {subTasksP2.map((subTask, index) => {
                return (
                  <Pressable
                    onPress={() => {
                      if (player2Count < 60) {
                        alert(
                          "Wait 1 min before checking off another sub-quest"
                        );
                      } else {
                        if (game["player2"]["email"] === user["email"]) {
                          playAttack();
                          user["activeQuest"]["subTasks"].splice(
                            user["activeQuest"]["subTasks"].indexOf(subTask),
                            1
                          );
                          setUser({
                            activeQuest: user["activeQuest"],
                            avatar: user["avatar"],
                            coins: user["coins"],
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

                          updateDoc(doc(db, "users", user["email"]), {
                            activeQuest: user["activeQuest"],
                          });
                        } else {
                          playDamaged();
                          game["player2"]["activeQuest"]["subTasks"].splice(
                            game["player2"]["activeQuest"]["subTasks"].indexOf(
                              subTask
                            ),
                            1
                          );
                          updateDoc(
                            doc(db, "users", game["player2"]["email"]),
                            {
                              activeQuest:
                                game["player2"]["email"]["activeQuest"],
                            }
                          );
                        }

                        setPlayer1Health(
                          player1Health - player2DamagePerSubTask
                        );
                        setPlayer2AttackPressed(true);
                        subTasksP2.splice(subTasksP2.indexOf(subTask), 1);
                        setSubTasksP2(subTasksP2);
                      }
                    }}
                    key={index}
                    style={styles.textContainer}
                    disabled={game["player2"]["email"] != user["email"]}
                  >
                    <Text style={styles.text} key={index}>
                      □{subTask}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ImageBackground>
        </View>
        <HealthBar health={player1Health} isLower={true} />
        <Image style={styles.lowerAvatar} source={player1Avatar} />
        <Image style={styles.upperAvatar} source={player2Avatar} />
        <HealthBar health={player2Health} isLower={false} />
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
    fontFamily: "RetroGaming",
  },
  textContainer: {
    flex: 1,
    flexWrap: "nowrap",
    // marginLeft: 30,
    // marginTop: 5,
  },
  name: {
    fontSize: 30,
    color: "white",
    fontFamily: "RetroGaming",
    // marginLeft: 30,
    // marginTop: 5,
    // marginBottom: 30,
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
  },
  lowerAvatar: {
    width: 150,
    height: 150,
    marginLeft: 10,
    marginBottom: 20,
  },
  upperAvatar: {
    width: 150,
    height: 150,
    position: "absolute",
    top: 80,
    right: 20,
    transform: [{ scaleX: -1 }],
  },
});
