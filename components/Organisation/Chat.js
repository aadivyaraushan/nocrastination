import 'react-native-get-random-values';
import { ImageBackground, StyleSheet, Text, TextInput, View, Image, Pressable } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { db, rtdb } from '../../firebase';
import { doc, getDoc, getDocs } from 'firebase/firestore';
import { onValue, ref, set } from 'firebase/database';
import { UserContext } from '../../UserContext';
import { v4 as uuidv4 } from 'uuid';

const Message = ({ message }) => {
    const [username, setUsername] = useState();
    const [messages, setMessages] = useState([]);
    const text = message[1];

    useEffect(() => {
        const getUserName = async () => {
            try {
                const docRef = await getDoc(doc(db, 'users', message[2]));
                setUsername(docRef.data().displayName);
            } catch (e) {
                console.error('Error getting username: ', e.message);
            }
        };
        getUserName();
    }, []);

    return (
        <ImageBackground
            style={{ width: 220, height: 47 }}
            source={require('../../assets/backgrounds/textMessageBubble.png')}
        >
            <Text style={styles.messageTitle}>{username}</Text>
            <Text style={styles.messageText}>{text}</Text>
        </ImageBackground>
    );
};

const Chat = () => {
    const { user } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        onValue(ref(rtdb, `messages/${user.organisation}`), (snapshot) => {
            const messages = [];
            // converts object to array
            Object.entries(snapshot.val()).forEach((entry, index) => {
                const [key, value] = entry;
                console.log(value);
                messages.push([value.createdAt, value.text, value.userEmail]);
            });
            console.log('messages pre sort', messages);
            messages.sort((a, b) => a[0] - b[0]);
            console.log('messages', messages);
            setMessages(messages);
        });
    }, []);

    const handleAddMessage = async () => {
        if (message === '') {
            alert('Please enter a message');
            return;
        }

        set(ref(rtdb, `messages/${user.organisation}/${uuidv4()}`), {
            createdAt: Date.now(),
            text: message,
            userEmail: user.email
        });

        setMessage('');
    };

    return (
        <View>
            <ImageBackground
                source={require('../../assets/backgrounds/panels/mediumPanel.png')}
                style={styles.container}
            >
                <View style={styles.darkContainer}>
                    <View style={styles.messagesContainer}>
                        {messages.map((messageInArray, index) => {
                            console.log(messageInArray);
                            return <Message message={messageInArray} key={index} />;
                        })}
                    </View>
                    <View style={styles.inputBoxContainer}>
                        <ImageBackground
                            source={require('../../assets/backgrounds/inputFieldBubble.png')}
                            style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}
                        >
                            <TextInput
                                style={styles.inputBox}
                                onChangeText={setMessage}
                                value={message}
                                placeholder="Enter your message"
                            />
                            <Pressable onPress={handleAddMessage}>
                                <Image
                                    source={require('../../assets/icons/send.png')}
                                    style={styles.sendButton}
                                />
                            </Pressable>
                        </ImageBackground>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '95%',
        width: '95%'
    },
    darkContainer: {
        height: '90%',
        width: '90%',
        backgroundColor: '#12273C',
        marginHorizontal: '2.5%',
        marginVertical: '5%',
        flexDirection: 'column'
    },
    messagesContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    messageText: {
        fontFamily: 'PlayMeGames',
        color: 'black',
        fontSize: 12,
        textAlign: 'right',
        marginRight: 10
    },
    messageTitle: {
        fontFamily: 'PlayMeGames',
        color: 'black',
        fontSize: 10,
        textAlign: 'right',
        marginTop: 3,
        marginRight: 10
    },
    inputBoxContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%'
    },
    inputBox: {
        fontFamily: 'PlayMeGames',
        color: 'black',
        marginLeft: 15
    },
    sendButton: {
        height: 30,
        width: 30
    },
    sendButtonContainer: {
        flex: 1
    }
});
export default Chat;
