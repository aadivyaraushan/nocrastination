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

const Shop = () => {
  const [loaded] = useFonts({
    RetroGaming: require("../assets/fonts/RetroGaming-Regular.ttf"),
  });
  const { user, setUser } = useContext(UserContext);
  const [itemsJSX, setItemsJSX] = useState(
    <Text style={{ color: "white" }}>Hi!</Text>
  );
  const db = getFirestore();
  const items = [];
  const q = query(
    collection(db, "shop"),
    where("levelRequirement", "<=", user["level"])
  );

  useEffect(() => {
    getDocs(q)
      .then((querySnapshot) =>
        querySnapshot.forEach((doc) => {
          items.push(doc.data());
          // console.log("item added");
        })
      )
      .then(() => {
        // console.log(items);
        setItemsJSX(
          <View style={styles.itemsContainer}>
            {items.map((itemFromArr, index) => (
              <ImageBackground
                style={styles.itemBackground}
                source={require("../assets/shopPanel.png")}
                key={index}
              >
                <Text style={styles.itemText}>{itemFromArr["name"]}</Text>
              </ImageBackground>
            ))}
          </View>
        );
      });
  });
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", flex: 1 }}>
      <ImageBackground
        source={require("../assets/background.png")}
        style={styles.bg}
      >
        <Topbar />
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Themes</Text>
        </View>
        <View></View>
        <View style={styles.banner}>
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
    fontSize: 30,
    fontFamily: "RetroGaming",
    color: "white",
    textAlign: "center",
  },
  itemBackground: {
    width: 90,
    height: 110,
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
    height: "60%",
    width: "auto",
    resizeMode: "contain",
  },
});
