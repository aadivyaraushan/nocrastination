import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import Topbar from '../components/Topbar';
import BottomBar from '../components/BottomBar';
import { Audio } from 'expo-av';
import { useFonts } from 'expo-font';
import Button from '../components/Button';

const BattleSelect = ({ navigation }) => {
    const [sound, setSound] = useState();
    const [] = useFonts({
        RetroGaming: require('../assets/fonts/RetroGaming-Regular.ttf'),
        InkyThinPixels: require('../assets/fonts/InkyThinPixels-Regular.ttf'),
        PlayMeGames: require('../assets/fonts/Playmegames-Regular.ttf')
    });

    async function playTap() {
        const { sound } = await Audio.Sound.createAsync(require('../assets/sfx/tap2.mp3'));
        setSound(sound);

        await sound.playAsync();
    }

    return (
        <View>
            <ImageBackground
                source={require('../assets/backgrounds/background.png')}
                style={styles.bg}
            >
                <Topbar />
                <View style={styles.banner}>
                    <Text style={styles.bannerText}>BATTLE</Text>
                </View>
                <Button
                    onPress={() => {
                        playTap();
                        navigation.navigate('quests');
                    }}
                    style={{ marginTop: 50, alignSelf: 'center' }}
                >
                    Singleplayer
                </Button>
                <Button
                    onPress={() => {
                        playTap();
                        navigation.navigate('taskSelect');
                    }}
                    style={{ marginTop: 50, alignSelf: 'center' }}
                >
                    Multiplayer
                </Button>
                <BottomBar />
            </ImageBackground>
        </View>
    );
};

export default BattleSelect;

const styles = StyleSheet.create({
    bg: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
    },
    buttonContainer1: {
        width: 400,
        marginTop: 50
    },
    buttonContainer2: {
        width: 400,
        top: -20,
        marginTop: 20
    },
    button: {
        alignSelf: 'center'
    },
    banner: {
        marginTop: 50,
        backgroundColor: '#DD4141',
        width: '100%'
    },
    bannerText: {
        fontSize: 60,
        fontFamily: 'PlayMeGames',
        color: 'white',
        textAlign: 'center',
        paddingTop: 4
    }
});
