import { View, Text, StyleSheet } from "react-native";
import { useContext } from "react";
import Topbar from ".././components/Topbar";
import { UserContext } from "../UserContext";

export default function Homepage() {
  const { user, setUser } = useContext(UserContext);
  // console.log(message);

  return (
    <View>
      <Topbar />
    </View>
  );
}

const styles = StyleSheet.create({});
