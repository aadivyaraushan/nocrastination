import {
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    ScrollView,
    Pressable
} from 'react-native';
import { useState } from 'react';
import Topbar from '../components/Topbar.js';
import BottomBar from '../components/BottomBar.js';
import { useFonts } from 'expo-font';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { useContext, useEffect } from 'react';
import { UserContext } from '../UserContext.js';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from '@firebase/firestore';
import { Audio } from 'expo-av';

const Shop = () => {
    const [sound, setSound] = useState();
    const [] = useFonts({
        RetroGaming: require('../assets/fonts/RetroGaming-Regular.ttf'),
        InkyThinPixels: require('../assets/fonts/InkyThinPixels-Regular.ttf'),
        PlayMeGames: require('../assets/fonts/Playmegames-Regular.ttf')
    });
    const { user, setUser } = useContext(UserContext);
    const [itemsJSX, setItemsJSX] = useState();
    const [emotesJSX, setEmotesJSX] = useState();
    const items = [];
    const q = query(collection(db, 'shop'), where('levelRequirement', '<=', user['level']));
    const emotes = [];
    const q2 = query(collection(db, 'emotes'), where('levelRequirement', '<=', user['level']));

    async function playPurchaseSound() {
        const { sound } = await Audio.Sound.createAsync(require('../assets/sfx/itemPurchase.mp3'));
        setSound(sound);
        await sound.playAsync();
    }

    async function playPurchaseFailed() {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/sfx/purchaseFailed.mp3')
        );
        setSound(sound);

        await sound.playAsync();
    }

    useEffect(() => {
        console.log(user);
    }, [user]);

    useEffect(() => {
        getDocs(q)
            .then((querySnapshot) =>
                querySnapshot.forEach((doc) => {
                    items.push(doc);
                })
            )
            .then(() => {
                const level = user['level'];
                setItemsJSX(
                    <ScrollView
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            bottom: 90
                        }}
                        horizontal={true}
                    >
                        {items.map((itemFromArr, index) => {
                            const requirement = itemFromArr.data()['levelRequirement'];
                            if (requirement > level) {
                                return (
                                    <ImageBackground
                                        style={styles.itemBackground}
                                        source={require('../assets/backgrounds/lockedBG.png')}
                                        key={index}
                                    >
                                        <Text style={styles.itemText}>
                                            Unlocked at level {requirement}!
                                        </Text>
                                    </ImageBackground>
                                );
                            } else {
                                let image;
                                switch (itemFromArr.data()['name']) {
                                    case 'Laser Eyes':
                                        image = require('../assets/abilities/laserEyes.png');
                                        break;
                                    case 'pyrokinesis':
                                        image = require('../assets/abilities/pyrokinesis.png');
                                        break;
                                    case 'regeneration':
                                        image = require('../assets/icons/heart.png');
                                        break;
                                    case 'shield':
                                        image = require('../assets/weapons/shield.png');
                                        break;
                                    case 'sword':
                                        image = require('../assets/weapons/sword.png');
                                        break;
                                    case 'telekinesis':
                                        image = require('../assets/icons/bottomBar/shopIcon.png');
                                        break;
                                }

                                let multiplayerBoost;
                                if (itemFromArr.data()['type'] === 'offensive') {
                                    multiplayerBoost = (
                                        <Text style={styles.itemFooter}>
                                            +{itemFromArr.data()['damageBoost']} damage
                                        </Text>
                                    );
                                } else if (itemFromArr.data()['healthBoost'] != 'regeneration') {
                                    multiplayerBoost = (
                                        <Text style={styles.itemFooter}>
                                            +{itemFromArr.data()['healthBoost']} health
                                        </Text>
                                    );
                                } else {
                                    multiplayerBoost = (
                                        <Text style={styles.itemFooter}>Increasing health</Text>
                                    );
                                }

                                return (
                                    <ImageBackground
                                        style={styles.itemBackground}
                                        source={require('../assets/backgrounds/panels/shopPanel.png')}
                                        key={index}
                                    >
                                        <Pressable
                                            onPress={() => {
                                                const items = user['items'];
                                                let purchasedBy;
                                                getDoc(doc(db, 'shop', itemFromArr.id))
                                                    .then((docSnap) => {
                                                        if (docSnap.exists()) {
                                                            console.log(
                                                                'Document snapshot exists!'
                                                            );
                                                            purchasedBy =
                                                                docSnap.get('purchasedBy');
                                                        } else {
                                                            console.log(
                                                                "Document snapshot doesn't exist"
                                                            );
                                                        }
                                                    })
                                                    .then(() => {
                                                        console.log(purchasedBy);
                                                        if (
                                                            purchasedBy.indexOf(user['email']) != -1
                                                        ) {
                                                            playPurchaseFailed();
                                                            alert('You already have this item!');
                                                            return;
                                                        } else if (
                                                            user['coins'] >=
                                                                itemFromArr.data()['priceCoins'] &&
                                                            purchasedBy.indexOf(user['email']) == -1
                                                        ) {
                                                            items.push(itemFromArr.id);
                                                            const coins =
                                                                user['coins'] -
                                                                itemFromArr.data()['priceCoins'];
                                                            console.log(user['coins']);
                                                            console.log(items);
                                                            // setUser({
                                                            //     activeQuest: user['activeQuest'],
                                                            //     avatar: user.avatar,
                                                            //     coins: user['coins'],
                                                            //     currentXp: user['currentXp'],
                                                            //     diamonds: user['diamonds'],
                                                            //     displayName: user['displayName'],
                                                            //     email: user['email'],
                                                            //     level: user['level'],
                                                            //     questsDone: user['questsDone'],
                                                            //     tasks: user['tasks'],
                                                            //     items: items,
                                                            //     emotes: user['emotes'],
                                                            //     avatar: user['avatar'],
                                                            //     winstreak: user.winstreak
                                                            // });
                                                            setUser((user) => ({
                                                                ...user,
                                                                coins,
                                                                items
                                                            }));
                                                            purchasedBy.push(user['email']);

                                                            updateDoc(
                                                                doc(db, 'users', user['email']),
                                                                {
                                                                    coins,
                                                                    items: items
                                                                }
                                                            )
                                                                .then(() => {
                                                                    console.log(
                                                                        'updated user coins'
                                                                    );
                                                                    updateDoc(
                                                                        doc(
                                                                            db,
                                                                            'shop',
                                                                            itemFromArr.id
                                                                        ),
                                                                        {
                                                                            purchasedBy: purchasedBy
                                                                        }
                                                                    );
                                                                })
                                                                .then(() => {
                                                                    console.log(
                                                                        'Updated purchasedBy'
                                                                    );
                                                                });

                                                            playPurchaseSound();
                                                            alert('Item purchased!');
                                                        } else {
                                                            playPurchaseFailed();
                                                            alert('Insufficient funds!');
                                                        }
                                                    });
                                            }}
                                            android_disableSound={true}
                                        >
                                            <Text style={styles.itemText}>
                                                {itemFromArr.data()['name']}
                                            </Text>
                                            <Image style={styles.itemImage} source={image}></Image>
                                            <Image
                                                style={styles.coinIcon}
                                                source={require('../assets/icons/coin.png')}
                                            />
                                            <Text style={styles.itemFooter}>
                                                {itemFromArr.data()['priceCoins']}
                                            </Text>
                                            <Text style={styles.itemFooter}>
                                                {itemFromArr.data()['multiplierXP']}x XP,{' '}
                                                {itemFromArr.data()['multiplierCoins']}x coins
                                            </Text>
                                            {multiplayerBoost}
                                        </Pressable>
                                    </ImageBackground>
                                );
                            }
                        })}
                    </ScrollView>
                );
            });

        getDocs(q2)
            .then((querySnapshot) =>
                querySnapshot.forEach((doc) => {
                    emotes.push(doc);
                })
            )
            .then(() => {
                const level = user['level'];
                setEmotesJSX(
                    <ScrollView style={styles.itemsContainer} horizontal={true}>
                        {emotes.map((emoteFromArr, index) => {
                            const requirement = emoteFromArr.data()['levelRequirement'];
                            if (requirement > level) {
                                return (
                                    <ImageBackground
                                        style={styles.itemBackground}
                                        source={require('../assets/backgrounds/lockedBG.png')}
                                        key={index}
                                    >
                                        <Text style={styles.itemText}>
                                            Unlocked at level {requirement}!
                                        </Text>
                                    </ImageBackground>
                                );
                            } else {
                                let image;
                                switch (emoteFromArr.data()['name']) {
                                    case 'smile':
                                        image = require('../assets/emotes/smile.png');
                                        break;
                                    case 'embarrased':
                                        image = require('../assets/emotes/embarrased.png');
                                        break;
                                    case 'ROFL':
                                        image = require('../assets/emotes/rofl.png');
                                        break;
                                    case 'surprise':
                                        image = require('../assets/emotes/surprise.png');
                                        break;
                                }

                                return (
                                    <ImageBackground
                                        style={styles.itemBackground}
                                        source={require('../assets/backgrounds/panels/shopPanel.png')}
                                        key={index}
                                    >
                                        <Pressable
                                            onPress={() => {
                                                const emotes = user['emotes'];
                                                let purchasedBy;
                                                getDoc(doc(db, 'emotes', emoteFromArr.id))
                                                    .then((docSnap) => {
                                                        if (docSnap.exists()) {
                                                            console.log(
                                                                'Document snapshot exists!'
                                                            );
                                                            purchasedBy =
                                                                docSnap.get('purchasedBy');
                                                        } else {
                                                            console.log(
                                                                "Document snapshot doesn't exist"
                                                            );
                                                        }
                                                    })
                                                    .then(() => {
                                                        if (
                                                            purchasedBy.indexOf(user['email']) != -1
                                                        ) {
                                                            playPurchaseFailed();
                                                            alert('You already have this emote!');
                                                            return;
                                                        } else if (
                                                            user['diamonds'] >=
                                                                emoteFromArr.data()[
                                                                    'priceDiamonds'
                                                                ] &&
                                                            purchasedBy.indexOf(user['email']) == -1
                                                        ) {
                                                            emotes.push(emoteFromArr.id);
                                                            user['diamonds'] =
                                                                user['diamonds'] -
                                                                emoteFromArr.data()[
                                                                    'priceDiamonds'
                                                                ];
                                                            // setUser({
                                                            //     activeQuest: user['activeQuest'],
                                                            //     coins: user['coins'],
                                                            //     currentXp: user['currentXp'],
                                                            //     diamonds: user['diamonds'],
                                                            //     displayName: user['displayName'],
                                                            //     email: user['email'],
                                                            //     level: user['level'],
                                                            //     questsDone: user['questsDone'],
                                                            //     tasks: user['tasks'],
                                                            //     items: user['items'],
                                                            //     emotes: emotes,
                                                            //     avatar: user['avatar'],
                                                            //     winstreak: user.winstreak
                                                            // });
                                                            setUser((user) => ({
                                                                ...user,
                                                                emotes
                                                            }));
                                                            purchasedBy.push(user['email']);

                                                            updateDoc(
                                                                doc(db, 'users', user['email']),
                                                                {
                                                                    diamonds: user['diamonds'],
                                                                    emotes: emotes
                                                                }
                                                            )
                                                                .then(() => {
                                                                    console.log(
                                                                        'updated diamonds and emotes'
                                                                    );
                                                                    updateDoc(
                                                                        doc(
                                                                            db,
                                                                            'emotes',
                                                                            emoteFromArr.id
                                                                        ),
                                                                        {
                                                                            purchasedBy: purchasedBy
                                                                        }
                                                                    );
                                                                })
                                                                .then(() => {
                                                                    console.log(
                                                                        'Updated purchasedBy'
                                                                    );
                                                                });

                                                            playPurchaseSound();
                                                            alert('Emote purchased!');
                                                        } else {
                                                            playPurchaseFailed();
                                                            alert('Insufficient funds!');
                                                        }
                                                    });
                                            }}
                                        >
                                            <Text style={styles.itemText}>
                                                {emoteFromArr.data()['name']}
                                            </Text>
                                            <Image style={styles.itemImage} source={image}></Image>
                                            <Text style={styles.itemFooter}>
                                                {emoteFromArr.data()['priceDiamonds']}
                                            </Text>
                                            <Image
                                                style={styles.rubyIcon}
                                                source={require('../assets/icons/diamond.png')}
                                            />
                                        </Pressable>
                                    </ImageBackground>
                                );
                            }
                        })}
                    </ScrollView>
                );
            });
    }, [...items]);
    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
            <ImageBackground
                source={require('../assets/backgrounds/background.png')}
                style={styles.bg}
            >
                <Topbar />
                <View style={styles.banner}>
                    <Text style={styles.bannerText}>EMOTES</Text>
                </View>
                {emotesJSX}
                <View style={styles.itemsBanner}>
                    <Text style={styles.bannerText}>WEAPONS/ABILITIES</Text>
                </View>
                {itemsJSX}

                <BottomBar />
            </ImageBackground>
        </View>
    );
};
export default Shop;
const styles = StyleSheet.create({
    bg: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    banner: {
        marginTop: 50,
        backgroundColor: '#DD4141',
        width: '100%'
    },
    bannerText: {
        fontSize: 50,
        fontFamily: 'PlayMeGames',
        color: 'white',
        textAlign: 'center',
        paddingTop: 4
    },
    itemBackground: {
        width: 150,
        height: 220,
        resizeMode: 'contain',
        marginRight: 10,
        marginBottom: 10
    },
    itemsContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    itemText: {
        fontSize: 25,
        fontFamily: 'PlayMeGames',
        color: 'white',
        textAlign: 'center'
    },
    itemImage: {
        height: '40%',
        width: 'auto',
        resizeMode: 'contain'
    },
    itemFooter: {
        fontSize: 20,
        fontFamily: 'PlayMeGames',
        color: 'white',
        textAlign: 'center'
    },
    coinIcon: {
        resizeMode: 'contain',
        width: 'auto',
        height: 15,
        position: 'relative',
        right: 20,
        top: 16
    },
    rubyIcon: {
        resizeMode: 'contain',
        width: 'auto',
        height: 15,
        position: 'relative',
        right: 25,
        bottom: 16
    },
    itemsBanner: {
        backgroundColor: '#DD4141',
        width: '100%',
        bottom: 90
    }
});
