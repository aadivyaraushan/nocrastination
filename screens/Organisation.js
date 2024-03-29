import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { OrganisationContext } from '../OrganisationContext';
import Topbar from '../components/Topbar';
import BottomBar from '../components/BottomBar';
import { useFonts } from 'expo-font';
import Button from '../components/Button.js';
import { UserContext } from '../UserContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { NavigationContainer } from '@react-navigation/native';

const Organisation = ({ navigation }) => {
    const { organisation, setOrganisation } = useContext(OrganisationContext);
    const { user, setUser } = useContext(UserContext);

    const [] = useFonts({
        RetroGaming: require('../assets/fonts/RetroGaming-Regular.ttf'),
        InkyThinPixels: require('../assets/fonts/InkyThinPixels-Regular.ttf'),
        PlayMeGames: require('../assets/fonts/Playmegames-Regular.ttf')
    });

    const joinOrganisation = async () => {
        const id = organisation.name.replace(/\s+/g, '-').toLowerCase();
        await updateDoc(doc(db, `organisations/${id}`), {
            members: [...organisation.members, user.email]
        });
        await updateDoc(doc(db, `users/${user.email}`), {
            organisation: id
        });
        navigation.navigate('organisationPage');
        console.log('Joined organisation');
    };

    return (
        <View>
            <ImageBackground
                source={require('../assets/backgrounds/background.png')}
                style={styles.bg}
            >
                <Topbar />
                <View style={styles.banner}>
                    <Text style={styles.bannerText}>{organisation['name']}</Text>
                </View>
                <View style={styles.bannerSecondary}>
                    <Text style={styles.bannerTextSecondary}>Members</Text>
                </View>
                <ImageBackground
                    source={require('../assets/backgrounds/panels/mediumPanel.png')}
                    style={styles.panel}
                >
                    <ScrollView>
                        {organisation['members'].map((member, index) => {
                            if (index === 0)
                                return (
                                    <Text style={styles.text} key={index}>
                                        {member} (leader)
                                    </Text>
                                );
                            return (
                                <Text style={styles.text} key={index}>
                                    {member}
                                </Text>
                            );
                        })}
                    </ScrollView>
                </ImageBackground>
                <View style={styles.bannerSecondary}>
                    <Text style={styles.bannerTextSecondary}>Requirements</Text>
                </View>
                <ImageBackground
                    source={require('../assets/backgrounds/panels/mediumPanel.png')}
                    style={styles.panel}
                >
                    <Text style={styles.text}>
                        Minimum level: {organisation['requirements']['minLevel']}
                    </Text>
                    <Text style={styles.text}>
                        Minimum coins: {organisation['requirements']['minCoins']} coins
                    </Text>
                </ImageBackground>
                <View style={{ marginTop: 40 }}>
                    <Button
                        onPress={joinOrganisation}
                        disabled={
                            organisation.requirements.minLevel != user.level ||
                            organisation.requirements.minCoins > user.coins
                        }
                    >
                        JOIN
                    </Button>
                </View>
                <BottomBar />
            </ImageBackground>
        </View>
    );
};

export default Organisation;

const styles = StyleSheet.create({
    bg: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        display: 'flex',
        alignItems: 'center'
    },
    banner: {
        marginTop: 50,
        backgroundColor: '#DD4141',
        width: '100%'
    },
    bannerSecondary: {
        backgroundColor: '#DD4141',
        width: '100%'
    },
    bannerTextSecondary: {
        fontSize: 50,
        fontFamily: 'PlayMeGames',
        color: 'white',
        textAlign: 'center'
    },
    bannerText: {
        fontSize: 60,
        fontFamily: 'PlayMeGames',
        color: 'white',
        textAlign: 'center'
    },
    panel: {
        width: 250,
        height: 200,
        margin: 5,
        padding: 15
    },
    text: {
        fontSize: 20,
        fontFamily: 'PlayMeGames',
        color: 'white',
        textAlign: 'center'
    },
    joinButton: {
        marginTop: 30,
        resizeMode: 'contain'
    }
});
