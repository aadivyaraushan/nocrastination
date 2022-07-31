import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    Pressable,
    ScrollView,
    Animated,
    Alert
} from 'react-native';
import React, { useEffect } from 'react';
import { useContext, useRef, useState } from 'react';
import { QuestContext } from '../QuestContext';
import { GameContext } from '../GameContext';
import HealthBar from '../components/HealthBar';
import { setButtonStyleAsync } from 'expo-navigation-bar';
import { UserContext } from '../UserContext';
import { deleteDoc, doc, updateDoc } from '@firebase/firestore';
import { db, rtdb } from '../firebase';
import { Audio } from 'expo-av';
import { useFonts } from 'expo-font';
import { child, get, onValue, ref, remove, set, update } from 'firebase/database';

const MultiplayerBattle = ({ route, navigation }) => {
    // Declaration of necessary context
    const { user, setUser } = useContext(UserContext);
    const { quest, setQuest } = useContext(QuestContext);
    const { game, setGame } = useContext(GameContext);

    // Declaration of necessary data
    const rewardData = route.params;
    const [count, setCount] = useState(80);
    const [attackPressed, setAttackPressed] = useState(false);
    const [sound, setSound] = useState();
    const [isGameOver, setIsGameOver] = useState(false);
    const [] = useFonts({
        RetroGaming: require('../assets/fonts/RetroGaming-Regular.ttf'),
        InkyThinPixels: require('../assets/fonts/InkyThinPixels-Regular.ttf'),
        PlayMeGames: require('../assets/fonts/Playmegames-Regular.ttf')
    });

    // Multipliers
    const [multiplierXP, setMultiplierXP] = useState(1);
    const [multiplierCoins, setMultiplierCoins] = useState(1);

    useEffect(() => {
        user.items.map((item) => {
            console.log(item);
            const updateMultipliers = async () => {
                const docSnap = await getDoc(doc(db, 'shop', item));
                if (docSnap.exists()) {
                    setMultiplierCoins(
                        (multiplierCoins) => multiplierCoins * docSnap.data().multiplierCoins
                    );
                    setMultiplierXP((multiplierXP) => multiplierXP * docSnap.data().multiplierXP);
                } else {
                    console.log('item not found');
                }
            };
            updateMultipliers();
        });
    }, []);

    // Sound functions
    async function playDamaged() {
        const { sound } = await Audio.Sound.createAsync(require('../assets/sfx/damaged.mp3'));
        setSound(sound);
        await sound.playAsync();
    }

    async function playVictory() {
        const { sound } = await Audio.Sound.createAsync(require('../assets/sfx/victory.mp3'));
        setSound(sound);
        await sound.playAsync();
    }

    async function playDefeat() {
        const { sound } = await Audio.Sound.createAsync(require('../assets/sfx/defeat.mp3'));
        setSound(sound);
        await sound.playAsync();
    }

    async function playAttack() {
        const { sound } = await Audio.Sound.createAsync(require('../assets/sfx/attack.mp3'));
        setSound(sound);
        await sound.playAsync();
    }

    function playerWin() {
        alert('You won!');
        playVictory();
        console.log(user);
        console.log('winstreak', user.winstreak);
        const winstreakMultiplier = user.winstreak + 1;
        console.log('winstreakMultiplier: ', winstreakMultiplier);
        console.log('coin multiplier: ', multiplierCoins);
        console.log('xp multiplier: ', multiplierXP);

        updateDoc(doc(db, 'users', user['email']), {
            coins:
                user['coins'] +
                winstreakMultiplier * (multiplierCoins * rewardData[quest['difficulty']]['coins']),
            currentXp:
                user['currentXp'] +
                winstreakMultiplier * (multiplierXP * rewardData[quest['difficulty']]['xp']),
            winstreak: user.winstreak + 1
        })
            .then(() => {
                console.log('User document updated');
                // remove quest if subTasks is empty, otherwise update quest subTasks
                console.log(subTasks);
                if (subTasks === [] || subTasks === null || subTasks === undefined) {
                    console.log('if called');
                    console.log('User tasks: ', user['tasks']);
                    console.log('Task index: ', user['tasks'].indexOf(quest['title']));
                    user['tasks'].splice(user['tasks'].indexOf(quest['title']), 1);
                    console.log('New Tasks: ', user['tasks']);
                    updateDoc(doc(db, 'users', user['email']), {
                        tasks: user['tasks']
                    }).then(() => {
                        deleteDoc(doc(db, 'tasks', quest['title']));
                    });
                } else {
                    console.log('else called');
                    updateDoc(doc(db, 'tasks', quest['title']), {
                        subTasks: subTasks
                    });
                }
            })
            .then(() => {
                console.log('Updated quest-related documents');
                // setUser({
                //     activeQuest: user['activeQuest'],
                //     avatar: user['avatar'],
                //     coins:
                //         user['coins'] +
                //         winstreakMultiplier *
                //             (multiplierCoins * rewardData[quest['difficulty']]['coins']),
                //     currentXp:
                //         user['currentXp'] +
                //         winstreakMultiplier *
                //             (multiplierXP * rewardData[quest['difficulty']]['xp']),
                //     diamonds: user['diamonds'],
                //     displayName: user['displayName'],
                //     email: user['email'],
                //     emotes: user['emotes'],
                //     items: user['items'],
                //     level: user['level'],
                //     questsDone: user['questsDone'],
                //     tasks: user['tasks'],
                //     winstreak: user.winstreak + 1
                // });
                setUser((user) => ({
                    ...user,
                    coins:
                        user['coins'] +
                        winstreakMultiplier *
                            (multiplierCoins * rewardData[quest['difficulty']]['coins']),
                    currentXp:
                        user['currentXp'] +
                        winstreakMultiplier * (multiplierXP * rewardData[quest['difficulty']]['xp'])
                }));
            })
            .then(() => {
                console.log('User context updated');
            })
            .then(() => {
                console.log('Game removed');
                setIsGameOver(true);
            })
            .then(() => {
                setQuest(null);
                remove(ref(rtdb, `games/${game}`)).then(() => setGame(null));
            })
            .then(() => {
                navigation.navigate('homepage');
            });
    }

    function playerLose() {
        alert('You lost!');
        setIsGameOver(true);
        updateDoc(doc(db, 'tasks', quest['title']), {
            subTasks: subTasks
        })
            .then(() => {
                updateDoc(doc(db, 'users', user.email), {
                    winstreak: 0
                });
            })
            .then(() => {
                setUser((user) => {
                    return {
                        ...user,
                        winstreak: user.winstreak + 1
                    };
                });
            })
            .then(() => {
                navigation.navigate('homepage');
            });
    }

    // Preventing user from exiting the game
    useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            if (!isGameOver) {
                Alert.alert('You cannot leave until the quest is complete!', '', [
                    { text: 'OK', onPress: () => {} }
                ]);
            } else if (isGameOver) {
                navigation.dispatch(e.data.action);
            }
        });
    }, [navigation, isGameOver]);

    // Declaring damage for player
    let damage = 0;
    get(child(ref(rtdb), `games/${game}/damages`)).then((snapshot) => {
        if (snapshot.exists()) {
            if (isPlayerOne) {
                damage = snapshot.val()['player1'];
            } else {
                damage = snapshot.val()['player2'];
            }
        }
    });

    // Declaring state
    const [emotePressed, setEmotePressed] = useState('');
    // const [player1Emote, setPlayer1Emote] = useState(
    //   <Animated.Image
    //     style={[
    //       styles.emoteAnimation,
    //       {
    //         transform: player1EmoteAnim,
    //       },
    //     ]}
    //   />
    // );
    // const [player2Emote, setPlayer2Emote] = useState(
    //   <Animated.Image
    //     style={[
    //       styles.emoteAnimation,
    //       {
    //         transform: player2EmoteAnim,
    //       },
    //     ]}
    //   />
    // );
    const [emotesJSX, setEmotesJSX] = useState(<></>);
    const [subTasks, setSubTasks] = useState([]);
    const [health1, setHealth1] = useState();
    const [health2, setHealth2] = useState();
    const [player1Avatar, setPlayer1Avatar] = useState();
    const [player2Avatar, setPlayer2Avatar] = useState();
    const [displayName1, setDisplayName1] = useState();
    const [displayName2, setDisplayName2] = useState();
    const [subTasks1, setSubTasks1] = useState(<></>);
    const [subTasks2, setSubTasks2] = useState(<></>);
    const [isPlayerOne, setIsPlayerOne] = useState();
    const [lowerHealthBar, setLowerHealthBar] = useState(
        <HealthBar health={health1} isLower={true} />
    );
    const [upperHealthBar, setUpperHealthBar] = useState(
        <HealthBar health={health2} isLower={false} />
    );
    useEffect(() => {
        // Declaring isPlayerOne
        get(child(ref(rtdb), `games/${game}/emails`)).then((snapshot) => {
            if (snapshot.exists()) {
                setIsPlayerOne(snapshot.val()['player1'] === user['email']);
                // console.log(isPlayerOne);
            }
        });

        // Getting subTasks one time
        get(child(ref(rtdb), `games/${game}/subTasks`)).then((snapshot) => {
            if (snapshot.exists()) {
                if (isPlayerOne) setSubTasks(snapshot.val()['player1']);
                else setSubTasks(snapshot.val()['player2']);
                console.log('Extracted subTasks');
            }

            // Attaching listener to subTasks
            onValue(ref(rtdb, `games/${game}/subTasks`), (snapshot) => {
                if (snapshot.exists()) {
                    console.log('subTasks listener called');
                    const subTasksTemp = isPlayerOne
                        ? snapshot.val()['player1']
                        : snapshot.val()['player2'];
                    console.log('subTasksTemp: ', subTasksTemp);
                    // if (isPlayerOne) setSubTasks(snapshot.val()["player1"]);
                    // else setSubTasks(snapshot.val()["player2"]);
                    setSubTasks(subTasksTemp);
                }
            });
        });
        // Getting healths one time
        get(child(ref(rtdb), `games/${game}/healths`)).then((snapshot) => {
            if (snapshot.exists()) {
                const one = snapshot.val()['player1'];
                const two = snapshot.val()['player2'];
                if (isPlayerOne) {
                    setHealth1(one);
                    setHealth2(two);
                } else {
                    setHealth1(two);
                    setHealth2(one);
                }
                console.log('Extracted healths');
            }

            // Attaching listener to healths
            onValue(ref(rtdb, `games/${game}/healths`), (snapshot) => {
                console.log('Health listener called');
                if (snapshot.exists()) {
                    const one = snapshot.val()['player1'];
                    const two = snapshot.val()['player2'];
                    if (isPlayerOne) {
                        setHealth1(one);
                        setHealth2(two);
                    } else {
                        setHealth1(two);
                        setHealth2(one);
                    }
                }
            });
        });

        // Getting avatars
        get(child(ref(rtdb), `games/${game}/avatars`)).then((snapshot) => {
            if (snapshot.exists()) {
                if (isPlayerOne) {
                    switch (snapshot.val()['player1']) {
                        case 'wizard':
                            setPlayer1Avatar(require('../assets/avatars/wizard.gif'));
                            break;
                        case 'necromancer':
                            setPlayer1Avatar(require('../assets/avatars/necromancer.gif'));
                            break;
                    }
                    switch (snapshot.val()['player2']) {
                        case 'wizard':
                            setPlayer2Avatar(require('../assets/avatars/wizard.gif'));
                            break;
                        case 'necromancer':
                            setPlayer2Avatar(require('../assets/avatars/necromancer.gif'));
                            break;
                    }
                } else {
                    switch (snapshot.val()['player2']) {
                        case 'necromancer':
                            setPlayer1Avatar(require('../assets/avatars/necromancer.gif'));
                            break;
                        case 'wizard':
                            setPlayer1Avatar(require('../assets/avatars/wizard.gif'));
                            break;
                    }
                    switch (snapshot.val()['player1']) {
                        case 'necromancer':
                            setPlayer2Avatar(require('../assets/avatars/necromancer.gif'));
                            break;
                        case 'wizard':
                            setPlayer2Avatar(require('../assets/avatars/wizard.gif'));
                            break;
                    }
                }
            }
        });

        // Getting displayName
        get(child(ref(rtdb), `games/${game}/names`)).then((snapshot) => {
            if (snapshot.exists()) {
                if (isPlayerOne) {
                    setDisplayName1(snapshot.val()['player1']);
                    setDisplayName2(snapshot.val()['player2']);
                } else {
                    setDisplayName1(snapshot.val()['player2']);
                    setDisplayName2(snapshot.val()['player1']);
                }
            }
        });

        console.log('Attached listeners for subTasks and healths');

        // Listener for emotes
        onValue(ref(rtdb, `games/${game}/emote`), (snapshot) => {
            if (snapshot.exists()) {
                console.log('Emote used: ', snapshot);
                if (snapshot.val()['byPlayerOne']) {
                    if (isPlayerOne) {
                        // show animation for player one on left side
                        console.log('Emote used by player one -  showing animation on left side');
                    } else {
                        // show animation for player one on right side
                        console.log('Emote used by player one -  showing animation on right side');
                    }
                } else {
                    // animation was used by player 2
                    if (isPlayerOne) {
                        // show animation for player two on right side
                        console.log('Emote used by player two -  showing animation on right side');
                    } else {
                        // show animation for player two on left side
                        console.log('Emote used by player two -  showing animation on left side');
                    }
                }
            } else {
                console.log("Emote snapshot doesn't exist");
            }
        });
    }, []);

    useEffect(() => {
        console.log('Healths were changed: ', health1, health2);
        if (health1 <= 0) {
            playerLose();
        } else if (health2 <= 0) {
            playerWin();
        }
        setUpperHealthBar(<HealthBar health={health2} isLower={false} />);
        setLowerHealthBar(<HealthBar health={health1} isLower={true} />);
    }, [health1, health2]);

    useEffect(() => {
        console.log('Use effect for subTasks called, new subTasks: ', subTasks);
        if ((isPlayerOne && health2 > 0) || (!isPlayerOne && health1 > 0)) {
            console.log('Condition 1 satisfied');
            if (subTasks != null) {
                console.log('Condition 2 satisfied');
                setSubTasks1(
                    <>
                        {subTasks.map((subTask, index) => {
                            return (
                                <Pressable
                                    onPress={() => {
                                        console.log('Pressed');
                                        if (count < 60) {
                                            alert(
                                                'Wait 1 min before checking off another sub-quest'
                                            );
                                        } else {
                                            if (health2) {
                                                let subTasksTemp = subTasks;
                                                subTasksTemp.splice(
                                                    subTasksTemp.indexOf(subTask),
                                                    1
                                                );
                                                console.log(
                                                    'subTasksTemp(in subTasks1 JSX): ',
                                                    subTasksTemp
                                                );
                                                const updates = {};
                                                if (isPlayerOne) {
                                                    updates[`games/${game}/subTasks/player1`] =
                                                        subTasksTemp;
                                                    updates[`games/${game}/healths/player2`] =
                                                        health2 - damage;
                                                } else {
                                                    updates[`games/${game}/subTasks/player2`] =
                                                        subTasksTemp;
                                                    updates[`games/${game}/healths/player1`] =
                                                        health2 - damage;
                                                }

                                                update(ref(rtdb), updates).then(() => {
                                                    setAttackPressed(true);
                                                    playAttack();
                                                    // setSubTasks(subTasksTemp);
                                                });
                                            }
                                        }
                                    }}
                                    key={index}
                                    style={styles.textContainer}
                                    android_disableSound={true}
                                >
                                    <Text style={styles.text} key={index}>
                                        □{subTask}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </>
                );
            }
            setSubTasks2(<Text style={styles.text}>...</Text>);
            // } else {
            //   // console.log(health2);
            //   if (subTasks) {
            //     setSubTasks1(
            //       <>
            //         {subTasks.map((subTask, index) => {
            //           return (
            //             <Pressable
            //               onPress={() => {
            //                 console.log("Pressed");
            //                 if (count < 60) {
            //                   alert("Wait 1 min before checking off another sub-quest");
            //                 } else {
            //                   let subTasksTemp = subTasks;
            //                   subTasksTemp.splice(subTasksTemp.indexOf(subTask), 1);
            //                   const updates = {};
            //                   updates[`games/${game}/subTasks/player2`] = subTasksTemp;
            //                   console.log("Health2: " + health2);
            //                   console.log("Damage: " + damage);
            //                   updates[`games/${game}/healths/player1`] =
            //                     health2 - damage;
            //                   // console.log(updates);

            //                   update(ref(rtdb), updates).then(() => {
            //                     setAttackPressed(true);
            //                     playAttack();
            //                     // setHealth1(health1 - damage);
            //                   });
            //                 }
            //               }}
            //               key={index}
            //               style={styles.textContainer}
            //               disabled={isPlayerOne}
            //               android_disableSound={true}
            //             >
            //               <Text style={styles.text} key={index}>
            //                 □{subTask}
            //               </Text>
            //             </Pressable>
            //           );
            //         })}
            //       </>
            //     );
            //   }
            //   setSubTasks2(<Text style={styles.text}>...</Text>);
        }
    }, [subTasks, health2]);

    useEffect(() => {
        const arrJSX = [];
        user['emotes'].map((emoteName, index) => {
            let emote;
            switch (emoteName) {
                case 'embarrased':
                    emote = require('../assets/emotes/embarrased.png');
                    break;
                case 'rofl':
                    emote = require('../assets/emotes/rofl.png');
                    break;
                case 'smile':
                    emote = require('../assets/emotes/smile.png');
                    break;
                case 'surprise':
                    emote = require('../assets/emotes/surprise.png');
                    break;
            }
            arrJSX.push(
                <Pressable
                    key={index}
                    onPress={() => setEmotePressed(emoteName)}
                    // disabled={!(health2 <= 0 || health1 <= 0)}
                >
                    <Image key={index} source={emote} style={styles.emote} />
                </Pressable>
            );
        });
        setEmotesJSX(
            <>
                <View style={styles.emoteContainer}>
                    <ScrollView horizontal={true}>{arrJSX}</ScrollView>
                </View>
            </>
        );
    }, []);

    useEffect(() => {
        if (emotePressed != '') {
            console.log('Pressed emote: ' + emotePressed);
            set(ref(rtdb, `games/${game}/emote`), {
                emotePressed,
                byPlayerOne: isPlayerOne
            }).then(() => {
                console.log('set emote in database');
            });
        }
    }, [emotePressed]);

    return (
        <View>
            <ImageBackground
                source={require('../assets/backgrounds/background.png')}
                style={styles.bg}
            >
                {/* {emotesJSX} */}
                <View style={styles.panelsContainer}>
                    <ImageBackground style={styles.subTasksPanel}>
                        <View style={styles.subTasksContainer}>
                            <Text style={styles.name}>{displayName1}</Text>
                            {subTasks1}
                        </View>
                    </ImageBackground>
                    <ImageBackground style={styles.subTasksPanel}>
                        <View style={styles.subTasksContainer}>
                            <Text style={styles.name}>{displayName2}</Text>
                            {subTasks2}
                        </View>
                    </ImageBackground>
                </View>
                {upperHealthBar}
                <Image style={styles.upperAvatar} source={player2Avatar} />
                {/* {player2Emote} */}
                <Image style={styles.lowerAvatar} source={player1Avatar} />
                {/* {player1Emote} */}
                {lowerHealthBar}
            </ImageBackground>
        </View>
    );
};

export default MultiplayerBattle;

const styles = StyleSheet.create({
    bg: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        display: 'flex',
        flexDirection: 'column-reverse'
    },
    subTasksPanel: {
        backgroundColor: '#9EDBD8',
        width: 200,
        height: 175
    },
    subTasksContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },
    panelsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    text: {
        fontSize: 25,
        color: 'white',
        fontFamily: 'PlayMeGames',
        top: 0,
        left: 0,
        position: 'relative'
    },
    textContainer: {
        flex: 1,
        flexWrap: 'nowrap'
    },
    name: {
        fontSize: 30,
        color: 'white',
        fontFamily: 'PlayMeGames',
        marginBottom: 10,
        textDecorationStyle: 'solid',
        textDecorationLine: 'underline'
    },
    lowerAvatar: {
        width: 170,
        height: 170,
        marginLeft: 10,
        marginBottom: 100,
        resizeMode: 'contain',
        transform: [{ scaleX: -1 }],
        bottom: '30%'
    },
    upperAvatar: {
        width: 170,
        height: 170,
        // position: "absolute",
        top: '30%',
        left: '60%',
        resizeMode: 'contain'
    },
    emote: {
        resizeMode: 'contain',
        marginRight: 40
    },
    emoteContainer: {
        backgroundColor: '#0d0d0d',
        width: '100%',
        height: 75,
        bottom: 0,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
});
