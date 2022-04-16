import { StyleSheet, Text, View, Image,  ImageBackground, ScrollView, Pressable } from "react-native";
import React from "react";
import Topbar from '../components/Topbar.js'
import BottomBar from '../components/BottomBar.js'
import { useFonts } from 'expo-font';
import {db} from '../firebase.js';
import { collection, getDocs } from "firebase/firestore"; 
//const querySnapshot = async () => {await getDocs(collection(db, "ShopItems"))};
//shall be used when code is verified to work
const Shop = ()=>{
  const [loaded] = useFonts({
    e: require('../assets/fonts/RetroGaming-Regular.ttf'),
  });
  const qt = async () => await getDocs(collection(db, "users")).then(function(val){
    return val
  });
  console.log(qt);
  if (!loaded) {
    return null;
  }
  {//querySnapsot acts as replacement for db, shop
  }
  const querySnapshot =  [
    {
    "name": "shield",
    "image": require("../assets/coin.png"),
    "price": "20 coins",
    "level": "Level : 1",
    },
    {
      "name": "carrot",
      "image": require("../assets/ruby.png"),
      "price": "30 coins",
      "level": "Level : 10",
      }
    ];
    const q2 = [{
      "theme": "galatica",
    "image": require("../assets/coin.png"),
    "price": "77 coins",
    "level": "Level : 3",
    },
    {
      "theme": "mogus",
    "image": require("../assets/coin.png"),
    "price": "770 coins",
    "level": "Level : 30",
    },
  ]
    var i = 0;
  var items = []
  var themes = []
  querySnapshot.forEach(doc => {
    items.push(
    {"name":doc["name"],
    "image":doc["image"],
    "price":doc["price"],
  "level" : doc["level"]})
  })
  q2.forEach(doc => {
    themes.push(
      {"theme":doc["theme"],
      "image":doc["image"],
      "price":doc["price"],
      "level":doc["level"]}
    )
  })
    return (
      <View style = {{ flexWrap:"wrap", flex : 1,backgroundColor : "black"}}>
      <ImageBackground source = {require("../assets/background.png")}>
      <Topbar/>
        <ScrollView 
        
        
        contentContainerStyle={{
          
          flexWrap: "wrap",
        }}>
      <View style = {{flexWrap:"wrap", flex : 1, height : '50%', width : '100%', padding : 20}}>
      <Text style = {{fontFamily : 'e', fontSize : 100, color:"white", flex : 1}}>Themes</Text>
      <ScrollView style={{padding : 1}}

          horizontal = {2}
        contentContainerStyle={{
          flexWrap: "wrap",
          flex : 1,
          flexDirection : "row"
        }}>
       {themes.map((a) => {
          return(
            <Pressable style={styles.itemDiv} onpress={()=>
            {/*add funtionality for reducing points (get access to db for user and then reduce points,
              if points are not enough, alert user using alert() function)*/
            }}> 
          <View key = {Math.random()}>
            <Image key = {0} source = {a["image"]}></Image>
          <Text key = {1} style={styles.txt1}>{a["theme"]}</Text>
          <Text key = {2} style={styles.txt2}>{a["price"]}</Text> 
          <Text key = {3} style={styles.txt3}>{a["level"]}</Text>
          </View>
          </Pressable>
          );
          
        }
          )
          }
          </ScrollView>
          </View>
          <View style = {{flexWrap:"wrap", flex : 1, height : '50%', width : '100%', padding : 20}}>
          <Text style = {{fontFamily : 'e', fontSize : 100, color:"white", flex : 1}}>Items</Text>
      <ScrollView style={{padding : 2}}

          horizontal = {2}
        contentContainerStyle={{
          flexWrap: "wrap",
          flex : 1,
          flexDirection : "row"
        }}>
       {items.map((a) => {
          return(
            <Pressable style={styles.itemDiv} onpress={()=>
            {/*add funtionality for reducing points (get access to db for user and then reduce points,
              if points are not enough, alert user using alert() function)*/
            }}> 
          <View key = {Math.random()}>
            <Image key = {0} source = {a["image"]}></Image>
          <Text key = {1} style={styles.txt1}>{a["name"]}</Text>
          <Text key = {2} style={styles.txt2}>{a["price"]}</Text> 
          <Text key = {3} style={styles.txt3}>{a["level"]}</Text>
          </View>
          </Pressable>
          );
          
        }
          )
          }
          </ScrollView>
         </View>
         </ScrollView>
      <BottomBar/>
      </ImageBackground>
        
      </View>
  );
}
export default Shop;
const styles = StyleSheet.create({
  itemDiv : {

    backgroundColor : '#30D5C8',
    width : 200,
    height : 300,
    alignItems : "center",
    justifyContent : 'space-around',
    margin : 50,
    flexShrink : 1,
  
    fontFamily : 'e'
    
  },
  
  txt1 : {
    fontFamily : 'e',
    fontSize  : 30
  },
  txt2 : {
    fontFamily : 'e',
    fontSize  : 20
  },
  txt3 : {
    fontFamily : 'e',
    fontSize  : 13
  }
});
