import { ImageBackground, StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import Topbar from '.././components/Topbar';
import BottomBar from '../components/BottomBar';
import { Audio } from 'expo-av';
import { useFonts } from 'expo-font';
import Button from '../components/Button';

function Homepage({ navigation }) {
    const [sound, setSound] = useState();

    const [] = useFonts({
        RetroGaming: require('../assets/fonts/RetroGaming-Regular.ttf'),
        InkyThinPixels: require('../assets/fonts/InkyThinPixels-Regular.ttf'),
        PlayMeGames: require('../assets/fonts/Playmegames-Regular.ttf')
    });

    const handleQuest = () => {
        playTap2();
        navigation.navigate('battleselect');
    };

    async function playTap2() {
        const { sound } = await Audio.Sound.createAsync(require('../assets/sfx/tap2.mp3'));
        setSound(sound);

        await sound.playAsync();
    }

    useEffect(() => {
        return sound
            ? () => {
                  sound.unloadAsync();
              }
            : undefined;
    }, [sound]);

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('/home/aadivyaraushan/Documents/GitHub/nocrastination/assets/backgrounds/homepageBG.png')}
                style={styles.bg}
            >
                <Topbar />
                <BottomBar />
                <Button onPress={handleQuest} style={styles.questButton}>
                    BATTLE
                </Button>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    questButton: {
        alignSelf: 'center',
        top: '70%',
        position: 'relative'
    },
    bg: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
    }
});

export default Homepage;
