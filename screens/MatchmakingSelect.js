import {
    ActivityIndicator,
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import React, { useState } from 'react';
import Topbar from '../components/Topbar';
import BottomBar from '../components/BottomBar';
import { useContext, useEffect } from 'react';
import { get, ref, child, update } from 'firebase/database';
import { db, rtdb } from '../firebase';
import { NavigationContainer } from '@react-navigation/native';
import { UserContext } from '../UserContext';
import { GameContext } from '../GameContext';
import { QuestContext } from '../QuestContext';
import { Audio } from 'expo-av';
import { useFonts } from 'expo-font';
import { getDoc, doc, getDocs, collection, query, where } from 'firebase/firestore';

const LoadingMatchmaking = ({ navigation }) => {
    const { user, setUser } = useContext(UserContext);
    const { game, setGame } = useContext(GameContext);
    const { quest, setQuest } = useContext(QuestContext);
    const [health, setHealth] = useState(50);
    const [damage, setDamage] = useState(0);
    const [gamesJSX, setGamesJSX] = useState(<></>);
    const games = [];
    const [sound, setSound] = useState();
    const [] = useFonts({
        RetroGaming: require('../assets/fonts/RetroGaming-Regular.ttf'),
        InkyThinPixels: require('../assets/fonts/InkyThinPixels-Regular.ttf'),
        PlayMeGames: require('../assets/fonts/Playmegames-Regular.ttf')
    });
    async function playSelect() {
        const { sound } = await Audio.Sound.createAsync(require('../assets/sfx/tap2.mp3'));
        setSound(sound);
        await sound.playAsync();
    }
    async function playAdd() {
        const { sound } = await Audio.Sound.createAsync(require('../assets/sfx/tap1.mp3'));
        setSound(sound);
        await sound.playAsync();
    }

    const pressHandler = async (game, id) => {
        console.log('pressHandler triggered');
        setGame(id);
        let damageTemp = 0;
        let healthTemp = 100;
        const items = [];
        // 1. Get every document of the shops collection and append to the items array
        // 2. Loop through the items array and run the commented out logic for each item
        const querySnapshot = await getDocs(query(collection(db, 'shop'), where('a', '==', '1')));
        await querySnapshot.forEach((doc) => {
            items.push(doc.data());
        });
        // await console.log('items: ', items);
        for (let item of items) {
            if (item.type === 'regeneration') {
                // special regeneration stuff
                // console.log('regeneration');
            } else if (item.type === 'offensive') {
                // setDamage(damage => damage + item.damageBoost);
                // console.log('offensive item');
                damageTemp += item.damageBoost;
                console.log(damageTemp);
            } else if (item.type === 'defensive') {
                // setHealth(health => health + item.healthBoost)
                // console.log('defensive item');
                healthTemp += item.healthBoost;
                console.log(healthTemp);
            }
        }
        // await console.log('healthTemp: ', healthTemp, '\n', 'damageTemp: ', damageTemp);
        setHealth(healthTemp);
        setDamage(damageTemp);

        // navigation.navigate("multiplayerBattle");
    };

    useEffect(() => {
        console.log('health:', health);
        console.log('damage:', damage);
        console.log('game: ', game);
        const updates = {};
        if (health != 50 && damage != 0 && game) {
            let addedDamage = 0;
            console.log('Game type: ', typeof game);
            get(child(ref(rtdb), `/games/${game}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    // addedDamage = snapshot.val().healths.player1/snapshot.val().subTasks.player1.length;
                    console.log('Current game: ', snapshot.val());
                }
            });

            console.log('Setting game(player 2)');
            updates[`/games/${game}/avatars/player2`] = user['avatar'];
            updates[`/games/${game}/difficulty/player2`] = quest['difficulty'];
            updates[`/games/${game}/healths/player2`] = health;
            updates[`/games/${game}/damages/player2`] = damage + addedDamage;
            updates[`/games/${game}/levels/player2`] = user['level'];
            updates[`/games/${game}/names/player2`] = user['displayName'];
            updates[`/games/${game}/numberOfItems/player2`] = user['items'].length;
            updates[`/games/${game}/subTasks/player2`] = quest['subTasks'];
            updates[`/games/${game}/emails/player2`] = user['email'];
            updates[`/games/${game}/isLoaded`] = true;
            console.log('all updates: ', updates);
            update(ref(rtdb), updates).then(() => {
                console.log('updated');
                navigation.navigate('multiplayerBattle');
            });
        }
    }, [health, damage, game]);

    useEffect(() => {
        console.log('Current quest: ', quest);
        get(child(ref(rtdb), `games`)).then((games) => {
            let jsx = [];

            Object.entries(games.val()).forEach((entry, index) => {
                const [key, value] = entry;
                if (
                    value['difficulty']['player1'] === quest['difficulty'] &&
                    value['levels']['player1'] === user['level'] &&
                    value['emails']['player1'] != user['email']
                ) {
                    jsx.push(
                        <ImageBackground
                            source={require('../assets/backgrounds/panels/organisationBG.png')}
                            style={styles.gameBackground}
                            key={Math.random() * (index + 2)}
                        >
                            <Pressable
                                onPress={() => pressHandler(value, key)}
                                key={index + 1}
                                style={styles.gamePressable}
                            >
                                <Text style={styles.gameText}>Game {index + 1}</Text>
                                <Text style={styles.gameDetails}>
                                    Against: {value['names']['player1']}
                                </Text>
                                <Text style={styles.gameDetails}>
                                    Level: {value['levels']['player1']}
                                </Text>
                                <Text style={styles.gameDetails}>
                                    {value['numberOfItems']['player1']} items
                                </Text>
                            </Pressable>
                        </ImageBackground>
                    );
                }
            });
            setGamesJSX(
                <>
                    <View style={styles.gamesContainer}>{jsx}</View>
                </>
            );
        });
    }, []);

    return (
        <>
            <View>
                <ImageBackground
                    source={require('../assets/backgrounds/background.png')}
                    style={styles.bg}
                >
                    <Topbar />
                    <View style={styles.banner}>
                        <Text style={styles.bannerText}>Battle</Text>
                    </View>
                    {gamesJSX}
                    <Pressable
                        style={styles.addGameButton}
                        onPress={() => {
                            playAdd();
                            navigation.navigate('addGame');
                        }}
                        android_disableSound={true}
                    >
                        <Image
                            source={require('../assets/buttons/addGame.png')}
                            style={styles.addGameImage}
                        />
                    </Pressable>
                    <BottomBar />
                </ImageBackground>
            </View>
        </>
    );
};

export default LoadingMatchmaking;

const styles = StyleSheet.create({
    bg: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        display: 'flex'
    },
    text: {
        fontSize: 25,
        textAlign: 'center',
        width: '100%',
        color: 'white',
        fontFamily: 'PlayMeGames',
        alignSelf: 'center'
    },
    banner: {
        marginTop: 50,
        backgroundColor: '#DD4141',
        width: '100%'
    },
    bannerText: {
        fontSize: 40,
        fontFamily: 'PlayMeGames',
        color: 'white',
        textAlign: 'center'
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '70%'
    },
    gamesContainer: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
    },
    gameBackground: {
        width: 380,
        height: 120,
        resizeMode: 'contain',
        margin: 20,
        padding: 10
    },
    gamePressable: {},
    gameText: {
        fontSize: 30,
        fontFamily: 'PlayMeGames',
        color: 'white',
        textAlign: 'center'
    },
    gameDetails: {
        fontSize: 15,
        fontFamily: 'PlayMeGames',
        color: 'white',
        textAlign: 'left'
    },
    addGameButton: {
        width: 80,
        height: 80,
        position: 'absolute',
        bottom: 90,
        right: 10,
        zIndex: 2
    },
    addGameImage: {
        width: 80,
        height: 80
    }
});
