import { Alert, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { useContext, useEffect, useMemo, useState } from 'react';
import { QuestContext } from '../QuestContext';
import { useFonts } from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import { setStatusBarHidden } from 'expo-status-bar';
import { UserContext } from '../UserContext';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useKeepAwake } from 'expo-keep-awake';

const QuestActive = ({ route, navigation }) => {
    useKeepAwake();
    const rewardData = route.params;
    const { user, setUser } = useContext(UserContext);
    const [] = useFonts({
        RetroGaming: require('../assets/fonts/RetroGaming-Regular.ttf'),
        InkyThinPixels: require('../assets/fonts/InkyThinPixels-Regular.ttf'),
        PlayMeGames: require('../assets/fonts/Playmegames-Regular.ttf')
    });
    const [subTasks, setSubTasks] = useState([]);

    const potentialBackgrounds = [
        require('../assets/backgrounds/activeTaskBackgrounds/activePage1.png'),
        require('../assets/backgrounds/activeTaskBackgrounds/activePage2.png'),
        require('../assets/backgrounds/activeTaskBackgrounds/activePage3.png')
    ];
    const background = useMemo(
        () => potentialBackgrounds[Math.floor(Math.random() * potentialBackgrounds.length)],
        []
    );

    const { quest, setQuest } = useContext(QuestContext);
    const [time, setTime] = useState(quest['duration']);
    const isGameOver = time === 0;
    const [loaded] = useFonts({
        RetroGaming: require('../assets/fonts/RetroGaming-Regular.ttf')
    });
    const [multiplierXP, setMultiplierXP] = useState(1);
    const [multiplierCoins, setMultiplierCoins] = useState(1);
    const [intervalId, setIntervalId] = useState(null);

    const questComplete = async () => {
        const prevCoins = user.coins;
        const prevXP = user.currentXp;
        const tasks = user.tasks;
        tasks.splice(tasks.indexOf(quest.title), 1);
        setUser((user) => ({
            ...user,
            coins: user.coins + multiplierCoins * rewardData[quest.difficulty].coins,
            currentXp: user.currentXp + multiplierXP * rewardData[quest.difficulty].xp,
            questsDone: user.questsDone + 1,
            tasks
        }));
        console.log('user context updated');
        updateDoc(doc(db, 'users', user.email), {
            coins: prevCoins + multiplierCoins * rewardData[quest.difficulty].coins,
            currentXp: prevXP + multiplierXP * rewardData[quest.difficulty].xp,
            tasks: user.tasks
        })
            .then(() => {
                // console.log('updateDoc for quest rewards');
                // setIsGameOver(true);

                deleteDoc(doc(db, 'tasks', quest.title));
            })
            .then(() => {
                navigation.navigate('homepage');
                // console.log('deleteDoc for quest');
            });
    };
    useEffect(() => {
        setIntervalId(
            setInterval(() => {
                if (time === 0) {
                    // setIsGameOver(true);
                    return;
                }
                setTime((time) => time - 1);
                // setIsGameOver(false);
            }, 1000)
        );
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

    useEffect(() => {
        console.log('quest.subTasks: ', quest.subTasks);
        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            console.log('navigation called');
            console.log('time when navigation called: ', time);
            if (quest.subTasks.length === 0 || time <= 0) {
                console.log('game is over');
                navigation.dispatch(e.data.action);
                return;
            }
            console.log("Game isn't over");
            Alert.alert('You cannot leave until the quest is complete!', '', [
                {
                    text: 'OK',
                    onPress: () => {}
                }
            ]);
            console.log('alert sent');
        });
    }, [isGameOver, navigation, quest]);

    useEffect(() => {
        if (quest.subTasks.length === 0) {
            Alert.alert('Quest completed! You will now receive the rewards.');

            questComplete();
        } else if (time === 0 && quest.subTasks.length !== 0) {
            Alert.alert("You won't be getting the awards. Good try.");
            navigation.navigate('homepage');
        }
    }, [time, quest]);

    // useEffect(() => {
    //     if (time === 0) {
    //         clearInterval(intervalId);

    //         Alert.alert('Quest Completed?', 'Have you completed the quest?', [
    //             {
    //                 text: 'Yes',
    //                 onPress: () => {
    //                     Alert.alert('Quest completed! You will now receive the rewards.');
    //                     questComplete();
    //                 }
    //             },
    //             {
    //                 text: 'No',
    //                 onPress: () => {
    //                     Alert.alert("You won't be getting the rewards. Good try.");
    //                     // setIsGameOver(true);
    //                     navigation.navigate('homepage');
    //                 }
    //             }
    //         ]);

    //     }
    // }, [time]);

    useEffect(() => {
        console.log(quest);
    }, [quest]);

    return (
        <View>
            <ImageBackground
                style={styles.bg}
                source={background}
                onLayout={async () => {
                    await NavigationBar.setVisibilityAsync('hidden');
                    await setStatusBarHidden(true);
                }}
            >
                <Text style={styles.disclaimerText}>PUT THE PHONE DOWN!</Text>
                <Text style={styles.timerText}>
                    {Math.floor(time / 60) + ':' + Math.round(time % 60)}
                </Text>
                <View style={{ flexwidth: '50%', height: '30%', width: '100%' }}>
                    <ImageBackground
                        style={styles.subTaskContainer}
                        source={require('../assets/backgrounds/panels/shopPanel.png')}
                    >
                        {quest.subTasks.map((subTask) => {
                            return (
                                <Text
                                    style={styles.subTaskText}
                                    onPress={() => {
                                        quest.subTasks.splice(quest.subTasks.indexOf(subTask), 1);
                                    }}
                                >
                                    □ {subTask}
                                </Text>
                            );
                        })}
                    </ImageBackground>
                </View>
            </ImageBackground>
        </View>
    );
};

export default QuestActive;

const styles = StyleSheet.create({
    bg: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    disclaimerText: {
        marginTop: 50,
        fontSize: 50,
        textAlign: 'center',
        width: '100%',
        color: 'white',
        fontFamily: 'PlayMeGames',
        flex: 1
        // if i is even then it should be to the right else to the left
    },
    timerText: {
        marginTop: 350,
        fontSize: 45,
        textAlign: 'center',
        width: '100%',
        color: 'white',
        fontFamily: 'PlayMeGames'
    },
    subTaskText: {
        fontSize: 35,
        color: 'white',
        fontFamily: 'PlayMeGames',
        top: 0,
        left: 0,
        position: 'relative'
    },
    subTaskContainer: {
        flex: 1,
        flexWrap: 'nowrap',
        width: '100%',
        height: '100%'
    }
});
