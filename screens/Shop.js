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
      },
      {
        "name": "carrot",
        "image": require("../assets/ruby.png"),
        "price": "30 coins",
        "level": "Level : 10",
        },
        {
          "name": "carrot",
          "image": require("../assets/ruby.png"),
          "price": "30 coins",
          "level": "Level : 10",
          },
          {
            "name": "carrot",
            "image": require("../assets/ruby.png"),
            "price": "30 coins",
            "level": "Level : 10",
            },
            {
              "name": "carrot",
              "image": require("../assets/ruby.png"),
              "price": "30 coins",
              "level": "Level : 10",
              },
    ];
    var i = 0;
  var items = []
  querySnapshot.forEach(doc => {
    items.push(
    {"name":doc["name"],
    "image":doc["image"],
    "price":doc["price"],
  "level" : doc["level"]})
  })
  var t = 0;
    return (
      <View style = {{flexDirection : "row", flexWrap:"wrap", flex : 1, backgroundColor : "black"}}>
      <Topbar/>
      <ScrollView style={{ flex: 1 }}
        horizontal={true}
        nestedScrollEnabled={true}
        contentContainerStyle={{
          flex: 1,
          flexWrap: "wrap",
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
      <BottomBar/>

        
      </View>
  );
}
export default Shop;
const styles = StyleSheet.create({
  itemDiv : {

    backgroundColor : '#30D5C8',
    width : 450,
    height : 350,
    alignItems : "center",
    justifyContent : 'space-around',
    margin : 30,

    
    fontFamily : 'e'
    
  },
  it : {
    flexShrink : 1,
    width : "200",
    height : "300"

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
