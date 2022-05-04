import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  ScrollView,
  Pressable,
} from "react-native";
import { useState } from "react";
import Topbar from "../components/Topbar.js";
import BottomBar from "../components/BottomBar.js";
import { useFonts } from "expo-font";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useContext, useEffect } from "react/cjs/react.development";
import { UserContext } from "../UserContext.js";
import { db } from "../firebase";
import { doc, updateDoc } from "@firebase/firestore";
import { Audio } from "expo-av";

const Shop = () => {
  const [sound, setSound] = useState();
  const [loaded] = useFonts({
    RetroGaming: require("../assets/fonts/RetroGaming-Regular.ttf"),
  });
  const { user, setUser } = useContext(UserContext);
  const [itemsJSX, setItemsJSX] = useState();
  const [emotesJSX, setEmotesJSX] = useState();
  const items = [];
  const q = query(
    collection(db, "shop"),
    where("levelRequirement", "<=", user["level"])
  );
  const emotes = [];
  const q2 = query(
    collection(db, "emotes"),
    where("levelRequirement", "<=", user["level"])
  );

  async function playPurchaseSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sfx/itemPurchase.mp3")
    );
    setSound(sound);
    await sound.playAsync();
  }

  async function playPurchaseFailed() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sfx/purchaseFailed.mp3")
    );
    setSound(sound);

    await sound.playAsync();
  }

  useEffect(() => {
    getDocs(q)
      .then((querySnapshot) =>
        querySnapshot.forEach((doc) => {
          items.push(doc.data());
        })
      )
      .then(() => {
        const level = user["level"];
        setItemsJSX(
          <ScrollView
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              bottom: 90,
            }}
            horizontal={true}
          >
            {items.map((itemFromArr, index) => {
              const requirement = itemFromArr["levelRequirement"];
              if (requirement > level) {
                return (
                  <ImageBackground
                    style={styles.itemBackground}
                    source={require("../assets/lockedBG.png")}
                    key={index}
                  >
                    <Text style={styles.itemText}>
                      Unlocked at level {requirement}!
                    </Text>
                  </ImageBackground>
                );
              } else {
                let image;
                switch (itemFromArr["name"]) {
                  case "Laser Eyes":
                    image = require("../assets/laserEyes.png");
                    break;
                  case "pyrokinesis":
                    image = require("../assets/pyrokinesis.png");
                    break;
                  case "regeneration":
                    image = require("../assets/regeneration.png");
                    break;
                  case "shield":
                    image = require("../assets/shield.png");
                    break;
                  case "sword":
                    image = require("../assets/sword.png");
                    break;
                  case "telekinesis":
                    image = require("../assets/shopIcon.png");
                    break;
                }

                let multiplayerBoost;
                if (itemFromArr["type"] === "offensive") {
                  multiplayerBoost = (
                    <Text style={styles.itemFooter}>
                      +{itemFromArr["damageBoost"]} damage
                    </Text>
                  );
                } else if (itemFromArr["healthBoost"] != "regeneration") {
                  multiplayerBoost = (
                    <Text style={styles.itemFooter}>
                      +{itemFromArr["healthBoost"]} health
                    </Text>
                  );
                } else {
                  multiplayerBoost = (
                    <Text style={styles.itemFooter}>Increasing health</Text>
                  );
                }

                return (
                  <ImageBackground
                    style={styles.itemBackground}
                    source={require("../assets/shopPanel.png")}
                    key={index}
                  >
                    <Pressable
                      onPress={() => {
                        console.log("User's current state: ", user);
                        if (user["items"].indexOf(itemFromArr) != -1) {
                          playPurchaseFailed();
                          alert("You already have this item!");
                          return;
                        } else if (
                          user["coins"] >= itemFromArr["priceCoins"] &&
                          user["items"].indexOf(itemFromArr) == -1
                        ) {
                          user["items"].push(itemFromArr);
                          user["coins"] =
                            user["coins"] - itemFromArr["priceCoins"];
                          setUser({
                            activeQuest: user["activeQuest"],
                            coins: user["coins"],
                            currentXp: user["currentXp"],
                            diamonds: user["diamonds"],
                            displayName: user["displayName"],
                            email: user["email"],
                            level: user["level"],
                            multiplier: user["multiplier"],
                            questsDone: user["questsDone"],
                            tasks: user["tasks"],
                            items: user["items"],
                            emotes: user["emotes"],
                            avatar: user["avatar"],
                          });

                          updateDoc(doc(db, "users", user["email"]), {
                            coins: user["coins"] - itemFromArr["priceCoins"],
                            items: user["items"],
                          });

                          playPurchaseSound();
                          alert("Item purchased!");
                        } else {
                          playPurchaseFailed();
                          alert("Insufficient funds!");
                        }
                      }}
                      android_disableSound={true}
                    >
                      <Text style={styles.itemText}>{itemFromArr["name"]}</Text>
                      <Image style={styles.itemImage} source={image}></Image>
                      <Image
                        style={styles.coinIcon}
                        source={require("../assets/coin.png")}
                      />
                      <Text style={styles.itemFooter}>
                        {itemFromArr["priceCoins"]}
                      </Text>
                      <Text style={styles.itemFooter}>
                        {itemFromArr["multiplierXP"]}x XP,{" "}
                        {itemFromArr["multiplierCoins"]}x coins
                      </Text>
                      {multiplayerBoost}
                    </Pressable>
                  </ImageBackground>
                );
              }
            })}
          </ScrollView>
        );
      });

    getDocs(q2)
      .then((querySnapshot) =>
        querySnapshot.forEach((doc) => {
          emotes.push(doc.data());
        })
      )
      .then(() => {
        const level = user["level"];
        setEmotesJSX(
          <ScrollView style={styles.itemsContainer} horizontal={true}>
            {emotes.map((emoteFromArr, index) => {
              const requirement = emoteFromArr["levelRequirement"];
              if (requirement > level) {
                return (
                  <ImageBackground
                    style={styles.itemBackground}
                    source={require("../assets/lockedBG.png")}
                    key={index}
                  >
                    <Text style={styles.itemText}>
                      Unlocked at level {requirement}!
                    </Text>
                  </ImageBackground>
                );
              } else {
                let image;
                switch (emoteFromArr["name"]) {
                  case "smile":
                    image = require("../assets/smile.png");
                    break;
                  case "embarrased":
                    image = require("../assets/embarrased.png");
                    break;
                  case "ROFL":
                    image = require("../assets/rofl.png");
                    break;
                  case "surprise":
                    image = require("../assets/surprise.png");
                    break;
                }

                return (
                  <ImageBackground
                    style={styles.itemBackground}
                    source={require("../assets/shopPanel.png")}
                    key={index}
                  >
                    <Pressable
                      onPress={() => {
                        if (user["diamonds"] >= emoteFromArr["priceDiamonds"]) {
                          user["emotes"].push(emoteFromArr);
                          setUser({
                            activeQuest: user["activeQuest"],
                            coins: user["coins"],
                            currentXp: user["currentXp"],
                            diamonds:
                              user["diamonds"] - emoteFromArr["priceDiamonds"],
                            displayName: user["displayName"],
                            email: user["email"],
                            level: user["level"],
                            multiplier: user["multiplier"],
                            questsDone: user["questsDone"],
                            tasks: user["tasks"],
                            emotes: user["emotes"],
                            items: user["items"],
                            avatar: user["avatar"],
                          });

                          updateDoc(doc(db, "users", user["email"]), {
                            diamonds:
                              user["diamonds"] - emoteFromArr["priceDiamonds"],
                            emotes: user["emotes"],
                          });
                          playPurchaseSound();
                          alert("Emote purchased!");
                        } else {
                          playPurchaseFailed();
                          alert("Insufficient funds!");
                        }
                      }}
                    >
                      <Text style={styles.itemText}>
                        {emoteFromArr["name"]}
                      </Text>
                      <Image style={styles.itemImage} source={image}></Image>
                      <Text style={styles.itemFooter}>
                        {emoteFromArr["priceDiamonds"]}
                      </Text>
                      <Image
                        style={styles.rubyIcon}
                        source={require("../assets/ruby.png")}
                      />
                    </Pressable>
                  </ImageBackground>
                );
              }
            })}
          </ScrollView>
        );
      });
  }, [...items]);
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", flex: 1 }}>
      <ImageBackground
        source={require("../assets/background.png")}
        style={styles.bg}
      >
        <Topbar />
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Emotes</Text>
        </View>
        {emotesJSX}
        <View style={styles.itemsBanner}>
          <Text style={styles.bannerText}>Weapons/Abilities</Text>
        </View>
        {itemsJSX}

        <BottomBar />
      </ImageBackground>
    </View>
  );
};
export default Shop;
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
    fontSize: 40,
    fontFamily: "RetroGaming",
    color: "white",
    textAlign: "center",
  },
  itemBackground: {
    width: 150,
    height: 220,
    resizeMode: "contain",
    marginRight: 10,
    marginBottom: 10,
  },
  itemsContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  itemText: {
    fontSize: 15,
    fontFamily: "RetroGaming",
    color: "white",
    textAlign: "center",
  },
  itemImage: {
    height: "40%",
    width: "auto",
    resizeMode: "contain",
  },
  itemFooter: {
    fontSize: 15,
    fontFamily: "RetroGaming",
    color: "white",
    textAlign: "center",
  },
  coinIcon: {
    resizeMode: "contain",
    width: "auto",
    height: 15,
    position: "relative",
    right: 20,
    top: 16,
  },
  rubyIcon: {
    resizeMode: "contain",
    width: "auto",
    height: 15,
    position: "relative",
    right: 25,
    bottom: 16,
  },
  itemsBanner: {
    backgroundColor: "#DD4141",
    width: "100%",
    bottom: 90,
  },
});
