import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";

const HealthBar = ({ health, isLower }) => {
  let [bars, setBars] = useState([]);
  useEffect(() => {
    setBars([]);
    bars = [];
    for (let i = 10; i <= health; i += 10) {
      let key = Math.random();
      bars.push(
        <View
          style={{
            backgroundColor: "#E92720",
            width: 30,
            height: 20,
            borderColor: "#000",
            borderWidth: 2,
          }}
          key={key}
        ></View>
      );
      setBars(bars);
    }
  }, [health]);

  if (isLower) {
    return (
      <View style={styles.container}>
        <Image
          source={require("../assets/regeneration.png")}
          style={styles.heart}
        />
        <View style={styles.barsContainer}>{bars}</View>
      </View>
    );
  } else {
    return (
      <View style={styles.containerUpper}>
        <View style={styles.barsContainerUpper}>{bars}</View>
        <Image
          source={require("../assets/regeneration.png")}
          style={styles.heartUpper}
        />
      </View>
    );
  }
};

export default HealthBar;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
  },
  containerUpper: {
    display: "flex",
    flexDirection: "row-reverse",
    position: "relative",
    top: 150,
  },
  heart: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginBottom: 10,
  },
  heartUpper: {
    width: 30,
    height: 30,
    marginRight: 10,
    marginBottom: 10,
  },
  barsContainer: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    zIndex: 1,
    position: "absolute",
    width: "100%",
    left: 40,
    top: 2,
  },
  barsContainerUpper: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row-reverse",
    zIndex: 1,
    position: "absolute",
    width: "100%",
    left: 40,
    top: 2,
  },
});
