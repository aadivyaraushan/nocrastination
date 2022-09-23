import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../UserContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const ActivePlayer = ({ image, displayName }) => {
    return (
        <>
            <Image source={image} style={styles.playerImage} />
            <Text style={styles.playerName}>{displayName}</Text>
        </>
    );
};

const ActivePlayers = () => {
    const { user } = useContext(UserContext);
    const [playersInOrg, setPlayersInOrg] = useState([]);

    const getPlayers = async () => {
        try {
            const docRef = await getDoc(doc(db, 'organisations', user.organisation));
            if (docRef.exists()) {
                const players = docRef.data().members;
                const playersData = await Promise.all(
                    players.map(async (player, index) => {
                        const playerDocRef = await getDoc(doc(db, 'users', player));
                        if (playerDocRef.exists()) {
                            return [playerDocRef.data().displayName, playerDocRef.data().avatar];
                        }
                    })
                );
                setPlayersInOrg(playersData);
            }
        } catch (err) {
            console.error('Error getting players: ', err.message);
        }
    };

    useEffect(() => {
        getPlayers();
    }, []);

    return (
        playersInOrg !== [] && (
            <View>
                <ImageBackground
                    source={require('../../assets/backgrounds/panels/mediumPanel.png')}
                    style={styles.container}
                >
                    <View style={styles.darkContainer}>
                        {playersInOrg.map((playerInOrg, index) => {
                            console.log(playerInOrg);
                            let image;
                            if (playerInOrg[1] === 'necromancer') {
                                image = require('../../assets/avatars/profiles/necromancer.png');
                            } else if (playerInOrg[1] === 'wizard') {
                                image = require('../../assets/avatars/profiles/wizard.png');
                            }
                            console.log(image);
                            return (
                                <ActivePlayer
                                    key={index}
                                    displayName={playerInOrg[0]}
                                    image={image}
                                />
                            );
                        })}
                    </View>
                </ImageBackground>
            </View>
        )
    );
};

const styles = StyleSheet.create({
    darkContainer: {
        height: '90%',
        width: '90%',
        backgroundColor: '#12273C',
        marginHorizontal: '2.5%',
        marginVertical: '5%',
        flexDirection: 'column'
    },
    container: {
        height: '95%',
        width: '95%'
    },
    playerImage: {
        width: 72,
        height: 72
    },
    playerName: {
        fontFamily: 'PlayMeGames',
        color: 'white',
        textAlign: 'center'
    }
});
export default ActivePlayers;
