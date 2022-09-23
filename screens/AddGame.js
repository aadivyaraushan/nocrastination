import { ActivityIndicator, ImageBackground, StyleSheet, Text, View } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import Topbar from '../components/Topbar';
import BottomBar from '../components/BottomBar';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { set, ref, onValue, remove, child, get, update } from 'firebase/database';
import { UserContext } from '../UserContext';
import { db, rtdb } from '../firebase';
import { GameContext } from '../GameContext';
import { QuestContext } from '../QuestContext';
import { useFonts } from 'expo-font';

const id = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
console.log('ID: ', id);

const AddGame = ({ navigation }) => {
    const { user, setUser } = useContext(UserContext);
    const { game, setGame } = useContext(GameContext);
    const { quest, setQuest } = useContext(QuestContext);
    const [playerOneHealth, setPlayerOneHealth] = useState(100);
    const [playerOneDamage, setPlayerOneDamage] = useState(0);

    const [] = useFonts({
        RetroGaming: require('../assets/fonts/RetroGaming-Regular.ttf'),
        InkyThinPixels: require('../assets/fonts/InkyThinPixels-Regular.ttf'),
        PlayMeGames: require('../assets/fonts/Playmegames-Regular.ttf')
    });

    const [bodyJSX, setBodyJSX] = useState(
        <View style={styles.container}>
            <Text style={styles.text}>Adding game to queue</Text>
            <ActivityIndicator color="#ffff" size="large" />
        </View>
    );

    useEffect(() => {
        for (let itemName of user['items']) {
            console.log(itemName);
            getDoc(doc(db, 'shop', itemName)).then((docSnap) => {
                if (docSnap.exists()) {
                    console.log('docSnap exists');
                    // items.push(docSnap.data())
                    let item = docSnap.data();
                    if (item['name'] == 'regeneration') {
                        // special regeneration stuff
                    } else if (item['type'] == 'offensive')
                        setPlayerOneDamage(
                            (playerOneDamage) => (playerOneDamage += item['damageBoost'])
                        );
                    else if (item['type'] == 'defensive')
                        setPlayerOneHealth(
                            (playerOneHealth) => (playerOneHealth += item['healthBoost'])
                        );
                } else {
                    console.log('docSnap does not exist');
                }
            });
        }
    }, []);

    useEffect(() => {
        setGame(id);
        // console.log(playerOneHealth, playerOneDamage);
        console.log('Setting game(player 1)');

        get(child(ref(rtdb), `games/${id}/isLoaded`)).then((snapshot) => {
            let isOver;
            get(child(ref(rtdb), `games/${id}/isOver`))
                .then((snapshot) => (isOver = snapshot.val()))
                .then(() => {
                    console.log('isOver: ', isOver);
                    if (!snapshot.exists() || isOver) {
                        console.log('Condition passed(for set game)');
                        set(ref(rtdb, `games/${id}`), {
                            isLoaded: false,
                            names: {
                                player1: user['displayName'],
                                player2: ''
                            },
                            healths: {
                                player1: playerOneHealth,
                                player2: 100
                            },
                            subTasks: {
                                player1: quest['subTasks'],
                                player2: []
                            },
                            avatars: {
                                player1: user['avatar'],
                                player2: ''
                            },
                            numberOfItems: {
                                player1: user['items'].length,
                                player2: 0
                            },
                            levels: {
                                player1: user['level'],
                                player2: 1
                            },
                            difficulty: {
                                player1: quest['difficulty'],
                                player2: ''
                            },
                            damages: {
                                player1: playerOneDamage,
                                player2: 0
                            },
                            emails: {
                                player1: user['email'],
                                player2: ''
                            },
                            emote: {},
                            isOver: false
                        })
                            .then(() => {
                                console.log('Game set. Setting body.');
                                setBodyJSX(
                                    <View style={styles.container}>
                                        <Text style={styles.text}>
                                            Waiting for a player to join
                                        </Text>
                                        <ActivityIndicator color="#ffff" size="large" />
                                    </View>
                                );
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    }
                });
        });
    }, [playerOneHealth, playerOneDamage]);

    useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            remove(ref(rtdb, `games/${id}`))
                .then(() => {
                    console.log('Removed item');
                    navigation.dispatch(e.data.action);
                })
                .then(() => {
                    console.log('Dispatched original action');
                })
                .catch((error) => console.log(error));
        });
    }, [navigation]);

    useEffect(() => {
        onValue(ref(rtdb, `games/${id}/`), (snapshot) => {
            console.log('Game just changed. Snapshot val: ', snapshot.val());
            if (
                snapshot.exists() &&
                snapshot.val().names.player2 != '' &&
                snapshot.val().names.player2 != null
            ) {
                console.log('Condition passed(for update game)');
                update(ref(rtdb, `games/${id}/damages`), {
                    player1: snapshot.val().subTasks.player1
                        ? Math.round(
                              playerOneDamage +
                                  snapshot.val().healths.player2 /
                                      snapshot.val().subTasks.player1.length
                          )
                        : 0
                })
                    .then(() => {
                        console.log('Updated game');
                        setBodyJSX(
                            <View style={styles.container}>
                                <Text style={styles.text}>Player found!</Text>
                            </View>
                        );
                    })
                    .then(() => {
                        navigation.navigate('multiplayerBattle');
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        });
    }, []);

    return (
        <View>
            <ImageBackground
                source={require('../assets/backgrounds/background.png')}
                style={styles.bg}
            >
                <Topbar />
                <BottomBar />
                {bodyJSX}
            </ImageBackground>
        </View>
    );
};

export default AddGame;

const styles = StyleSheet.create({
    bg: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        display: 'flex'
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
    text: {
        fontSize: 25,
        textAlign: 'center',
        width: '100%',
        color: 'white',
        fontFamily: 'PlayMeGames',
        alignSelf: 'center'
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
    }
});
