import react from "React";
import { TextInput, StatusBar, Platofrm, StyleSheet, Text, View, Image, ImageBackground, Pressable, SafeAreaView, TouchableWithoutFeedback} from 'react-native';


const app = ()=>{
    return(
       <View style={{
        flexDirection: "row",
        height: '100%',
        padding: 0
      }}>
          <ImageBackground source = {require('./assets/App_homepage_background.png')}>
           <View style={styles.container_1}>
            //image 1
            <Image source = {require('../assets/x.jpg')}></Image>

            //level
            <Image source = {require('../assets/ruby_downscaled.png')}></Image>
            <Text>0</Text>

            //coins
            <Image source = {require('../assets/coin_pixel_art.png')}></Image>
            <Text>0</Text>
           </View>


         <TouchableWithoutFeedback style={{alignContent : "center"}}onpress={()=>console.log("Next Page")}>    //button, pls align to center
        <Image source = {require('./assets/Battle_button.png')}></Image>
         </TouchableWithoutFeedback>

           <View style={styles.container_2}>//pls align to end
           <Button><Image source = {require('../assets/Quests_icon.png')}></Image></Button>
           <Button><Image source = {require('../assets/Settings_icon.png')}></Image></Button>
           <Button> <Image source = {require('../assets/Shop_icon.png')}></Image></Button>
           <Button><Image source = {require('../assets/Social_Icon.png')}></Image></Button>

           </View>

           </ImageBackground>
       </View>
    );
}
export default app;

const styles = StyleSheet.create(
    {
       container_1 : {
            backgroundColor : "grey",
            height : '15%',
            flexDirection : "row",
            alignContent : "flex-start",
            paddingTop : Platofrm.OS === "android"?StatusBar.currentHeight:0
       },
       container_2 : {
        height : '20%',
        flexDirection : "row",
        justifyContent : "space-around",
        alignContent : "flex-end",
        paddingBottom : Platofrm.OS === "android"?StatusBar.currentHeight:0
       }

    }
);