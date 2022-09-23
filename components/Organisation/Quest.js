import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {doc, getDoc} from 'firebase/firestore';
import {db} from '../../firebase.js';

const Quest = ({organisation}) => {
    const [message, setMessage] = useState();
    const [rewards, setRewards] = useState();
    useEffect(() => {
        const fetchQuest = async () => {
            const docSnap = await getDoc(doc(db, `organisations/weekly-quest`));
            if (docSnap.exists()) {
                setMessage(docSnap.data().questMessage);
                setRewards(docSnap.data().questRewards);
            }
        };

        fetchQuest();
    }, []);

    return (
        <View style={styles.container}>
            {message && rewards && (
                <>
                    <View style={styles.panel}>
                        <View style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 40
                        }}>
                            <View style={styles.messageContainer}>
                                <Text style={styles.message} adjustsFontSizeToFit={true}>
                                    {message}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.rewardContainer}>
                            <Text style={styles.reward} adjustsFontSizeToFit={true}>
                                {rewards}
                            </Text>
                            <Image
                                source={require('../../assets/icons/trophy.png')}
                                style={styles.trophy}
                            ></Image>
                        </View>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    messageContainer: {
        width: '100%',
        height: 30,
    },
    panel: {
        backgroundColor: '#9DDBD8',
        display: 'flex',
        flexDirection: 'column'
    },
    message: {
        fontSize: 30,
        fontFamily: 'PlayMeGames',
        color: 'white',
    },
    reward: {
        fontFamily: 'PlayMeGames',
        color: 'white',
        textAlign: 'right',
        marginRight: 20,
        fontSize: 55,
        position: 'absolute',
        left: 50,
        top: 5
    },
    rewardContainer: {
        width: '100%',
        height: 50,
        display: 'flex',
        flexDirection: 'row-reverse',
    },
    trophy: {
        position: 'absolute',
        height: 55,
        width: 55
    },
    container: {
        flex: 0.5
    }
});

export default Quest;
