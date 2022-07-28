import { ImageBackground, StyleSheet, Text, TextInput, View } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { UserContext } from '../UserContext.js';
import { auth, db } from '../firebase';
import { Audio } from 'expo-av';
import { useFonts } from 'expo-font';
import Button from '../components/Button';

let userCred = null;

function convertMsToTime(milliseconds) {
    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    hours = hours % 24;

    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
}

function Login({ navigation }) {
    const [email, onChangeEmail] = useState('');
    const [password, onChangePassword] = useState('');
    const [sound, setSound] = useState();
    const { user, setUser } = useContext(UserContext);
    useFonts({
        RetroGaming: require('../assets/fonts/RetroGaming-Regular.ttf'),
        InkyThinPixels: require('../assets/fonts/InkyThinPixels-Regular.ttf'),
        PlayMeGames: require('../assets/fonts/Playmegames-Regular.ttf')
    });

    const handleLogin = async () => {
        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                userCred = userCredentials.user;
            })
            .catch((error) => alert(error.message));

        const docRef = await doc(db, 'users', userCred.email);
        const docSnap = await getDoc(docRef);
        const dayInMiliseconds = 24 * 60 * 60 * 1000;
        const twoDaysInMiliseconds = 2 * dayInMiliseconds;
        if (docSnap.exists()) {
            console.log(docSnap.data().lastLoggedIn.toDate());
            const difference = Math.abs(docSnap.data().lastLoggedIn.toDate() - Date.now());
            if (difference >= dayInMiliseconds && difference < twoDaysInMiliseconds) {
                alert(
                    `Congrats on continuing your login streak! You'll be getting ${Math.round(
                        ((docSnap.data().loginStreak + 1) * 100) / 60
                    )} coins now.`
                );
                await updateDoc(docRef, {
                    lastLoggedIn: Timestamp.now(),
                    loginStreak: docSnap.data().loginStreak + 1,
                    coins:
                        docSnap.data().coins +
                        Math.round(((docSnap.data().loginStreak + 1) * 100) / 60)
                });
            } else if (difference < dayInMiliseconds) {
                alert(
                    `Come back in ${convertMsToTime(
                        dayInMiliseconds - difference
                    )} to continue your login streak!`
                );
            }
            await setUser({
                ...docSnap.data(),
                coins:
                    docSnap.data().coins + Math.round(((docSnap.data().loginStreak + 1) * 100) / 60)
            });
            await navigation.navigate('homepage');
            console.log(difference);
            playSound();
        } else console.log('No such document!');
    };

    async function playSound() {
        const { sound } = await Audio.Sound.createAsync(require('../assets/sfx/tap2.mp3'));
        setSound(sound);

        await sound.playAsync();
    }

    useEffect(() => {
        return sound
            ? () => {
                  console.log('Unloading Sound');
                  sound.unloadAsync();
              }
            : undefined;
    }, [sound]);

    return (
        <View style={styles.container}>
            <ImageBackground
                style={styles.bg}
                source={require('./../assets/backgrounds/background.png')}
            >
                <View style={styles.banner}>
                    <Text style={styles.bannerText}>LOGIN</Text>
                </View>
                <View style={styles.inputFieldsContainer}>
                    <ImageBackground
                        source={require('../assets/backgrounds/inputFieldBubble.png')}
                        style={styles.inputFieldContainer}
                    >
                        <TextInput
                            style={styles.inputFields}
                            onChangeText={onChangeEmail}
                            value={email}
                            placeholder="Email"
                            placeholderTextColor="black"
                        />
                    </ImageBackground>

                    <ImageBackground
                        source={require('../assets/backgrounds/inputFieldBubble.png')}
                        style={styles.inputFieldContainer}
                    >
                        <TextInput
                            style={styles.inputFields}
                            onChangeText={onChangePassword}
                            value={password}
                            placeholder="Password"
                            placeholderTextColor="black"
                            secureTextEntry
                        />
                    </ImageBackground>
                    <Button onPress={handleLogin} style={styles.submit}>
                        Submit
                    </Button>
                </View>
            </ImageBackground>
        </View>
    );
}

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    banner: {
        backgroundColor: '#DD4141',
        width: '100%'
    },
    bannerText: {
        fontSize: 60,
        fontFamily: 'PlayMeGames',
        color: 'white',
        textAlign: 'center',
        paddingTop: 4
    },
    bg: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start'
    },
    inputFields: {
        backgroundColor: 'transparent',
        fontFamily: 'PlayMeGames',
        color: 'black',
        marginLeft: 15,
        marginTop: 10
    },
    inputFieldsContainer: {
        marginTop: 80,
        display: 'flex'
    },
    submit: {
        resizeMode: 'contain',
        marginTop: 50,
        alignSelf: 'center'
    },
    inputFieldContainer: {
        resizeMode: 'cover',
        width: 320,
        height: 50,
        marginTop: 25,
        marginLeft: 15
    }
});
