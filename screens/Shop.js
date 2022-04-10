import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Topbar from 'components/Topbar.js'
import BottomBar from 'components/BottomBar.js'
import {auth, db} from 'firebase.js';
import { collection, getDocs } from "firebase/firestore"; 
import { assertYieldExpression } from "babel-types";
/*
1) Shop Component (done)
2) Setting each item in scrollable flex-box with 2 in each row
*/
const querySnapshot = async () => {await getDocs(collection(db, "ShopItems"))};
var items = []
const Item = (props) => {
  return (

    <View style={styles.itemDiv}>
      <Image source={require(props.image)}>
      </Image>
      <Text>{props.name}</Text>
      <Text>{props.price}</Text>

    </View>
  );
}
querySnapshot.forEach((doc) => {
  items.push(
  {"name":doc.data()["name"],
  "image":doc.data()["image"],
  "price":doc.data()["price"]})
})
const Shop = () => {
  return (
    <View style = {{flexDirection : "row", flexWrap : "wrap", backgroudnColor : "black"}}>
      <Topbar/>
      //needs code for positioning
      {items.map(i=>{
        return <Item name = {i["name"]} image = {i["image"]} price = {i["price"]} style = {styles.it}></Item>
      })}//to render each item
      <BottomBar/>
    </View>
  );
};

export default Shop;

const styles = StyleSheet.create({
  itemDiv : {
    backgroundColor : 'turquoiuse',
    alignContent : 'center',
    justifyContent : 'center'
  },
  it : {
    flex : 1,
    flexShrink : 1
  }
});
