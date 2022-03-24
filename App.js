import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ImageBackground, Pressable } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
       <ImageBackground style={styles.bg} source={require("./assets/background.png")}>
          <Image source={require("./assets/loginBanner.png") } style={styles.banner} />
       	     <View style={styles.buttonsContainer}>
	        <Pressable>
                   <Image source={require("./assets/buttons/login.png")} style={styles.buttons} />
	        </Pressable>
	        <Pressable>
                   <Image source={require("./assets/buttons/signup.png")} style={styles.buttons} />
	        </Pressable>
	        <Pressable>
	           <Image source={require("./assets/buttons/classcode.png")} style={styles.buttons}/>
	        </Pressable>
	  </View>
	  </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  banner: {
    resizeMode: "contain",
    position: "absolute",
    top: 0,
    width: "100%",
    height: "10%",
    backgroundColor: "black"
  },
  bg: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
  },
  buttons: {
    marginTop: 50,
    width: "100%",
    resizeMode: "contain"
  },
  buttonsContainer: {
    top: 100,
  }
});
