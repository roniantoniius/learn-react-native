import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, StatusBar, Dimensions } from 'react-native';
import colors from '../misc/colors';
import RoundIconBtn from '../components/RoundIconBtn';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Intro = () => {
    const [name, setName] = useState('');
    const handleOnChangeText = (text) => setName(text);
    const handleSubmit = async() => {
        const user = { name: name}
        await AsyncStorage.setItem('user', JSON.stringify(user));
    }

    return (
        <>
            <StatusBar hidden={true}/>
            <View style={styles.container}>

                <Text style={styles.inputTitle}>Enter Your Name Here!</Text>

                <TextInput value={name} onChangeText={handleOnChangeText} placeholder='Enter Name' style={styles.textInput} />

                {name.trim().length >= 3 ? (
                    <RoundIconBtn antIconName='arrowright' onPress={handleSubmit} />
                ) : null}
            </View>
        </>
    );
}

const width = Dimensions.get('window').width - 50;
console.log(width);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInput: {
        height: 50,
        color: colors.PRIMARY,
        width,
        borderColor: colors.PRIMARY,
        borderWidth: 2,
        borderRadius: 10,
        paddingLeft: 15,
        fontSize: 25,
        marginBottom: 15,
    },
    inputTitle: {
        alignSelf: 'flex-start',
        paddingLeft: 25,
        marginBottom: 5,
        opacity: 0.5,
    }
});

export default Intro;
