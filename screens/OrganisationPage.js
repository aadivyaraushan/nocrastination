import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Quest from '../components/Organisation/Quest.js';
import {doc, getDoc} from 'firebase/firestore';
import {db} from '../firebase.js';
import {UserContext} from '../UserContext.js';
import Topbar from '../components/Topbar.js';
import BottomBar from '../components/BottomBar.js';
import ActivePlayers from "../components/Organisation/ActivePlayers";
import Chat from "../components/Organisation/Chat";

const OrganisationPage = () => {
    const {user, setUser} = useContext(UserContext);
    const [organisation, setOrganisation] = useState(null);

    useEffect(() => {
        const fetchOrganisation = async () => {
            const docSnap = await getDoc(doc(db, `organisations/${user.organisation}`));
            if (docSnap.exists()) setOrganisation(docSnap.data());
        };
        fetchOrganisation();
    }, []);

    return (
        <View>
            <ImageBackground
                source={require('../assets/backgrounds/background.png')}
                style={styles.bg}
            >
                <Topbar/>
                {organisation && (
                    <>
                        <View style={styles.banner}>
                            <Text style={styles.bannerText}>{organisation.name}</Text>
                        </View>
                        <View style={styles.panelsContainer}>
                            <Quest organisation={organisation}/>
                            <View style={styles.lowerSection}>
                                <View style={{flex: 3}}><Chat/></View>
                                <View style={{flex: 1}}><ActivePlayers/></View>
                            </View>
                        </View>
                    </>
                )}
                <BottomBar/>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    bg: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        display: 'flex',
        flexDirection: 'column',
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
    },
    lowerSection: {
        marginTop: 30,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        flex: 4,
        // backgroundColor: 'blue'
    },
    panelsContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 2,
        justifyContent: 'space-between',
        // backgroundColor: 'red',
        marginHorizontal: 20,
        marginVertical: 20
    }
});

export default OrganisationPage;
