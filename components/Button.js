import React from 'react';
import { ImageBackground, Text, StyleSheet, View, Pressable } from 'react-native';

const Button = ({ children, onPress, style, size, disabled = false }) => {
    return (
        <View style={style}>
            <ImageBackground
                source={
                    disabled
                        ? require('../assets/backgrounds/disabledButtonBackground.png')
                        : require('../assets/backgrounds/buttonBackground.png')
                }
                style={styles.bg}
            >
                <Pressable onPress={onPress} android_disableSound={true}>
                    <Text
                        style={{
                            fontFamily: 'PlayMeGames',
                            fontSize: children.length >= 7 ? 40 : 70,
                            color: 'white',
                            marginTop: children.length >= 7 ? 23 : 10,
                            textAlign: 'center',
                            textTransform: 'uppercase'
                        }}
                        numberOfLines={1}
                        adjustsFontSizeToFit={true}
                    >
                        {children}
                    </Text>
                </Pressable>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    bg: {
        width: 256,
        height: 77,
        resizeMode: 'cover'
    },
    textContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default Button;
