import { StyleSheet, View, Text, Image } from "react-native";
import react from "react"
import { TouchableWithoutFeedback } from "react-native-web";

function BottomBar(){
    return(
        <View sytle={{
            flexDirection : "row", 
            backgroundColor:"black", 
            alignContent : "flex-end",
            justifyContent : "space-between"}}>
        <TouchableWithoutFeedback style={{flex:1}} onpress={()=>console.log("Change to Quests page")}>
    
        <Image source={require("../assets/Quests_icon.png")}>
        </Image>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback style={{flex:1}} onpress={()=>console.log("Change to Settings page")}>
        <Image source={require("../assets/Settings_icon.png")}>
        </Image>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback style={{flex:1}} onpress={()=>console.log("Change to Shop page")}>
        <Image source={require("../assets/Shop_icon.png")}>
        </Image>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback style={{flex:1}} onpress={()=>console.log("Change to Social page")}>
        <Image source={require("../assets/Social_icon.png")}>
        </Image>
        </TouchableWithoutFeedback>
        </View>
    );
}


export default BottomBar;