import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Topbar from ".././components/Topbar.js";
import { StatusBar } from "expo-status-bar";

export default function Homepage() {
  return (
	<View style={styles.container}>
				<StatusBar translucent={false} style={"inverted"} />
		<Topbar style={styles.topBar} />
		<View style={styles.placeholder} />
	</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  placeholder: {
	flex: 1

}
});
