import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, Keyboard, TouchableWithoutFeedback, StatusBar } from 'react-native';
import colors from '../misc/colors';
import SearchBar from '../components/SearchBar';
import Note from '../components/Note';
import { FlatList } from 'react-native-gesture-handler';
import RoundIconBtn from '../components/RoundIconBtn';
import NoteInputModal from '../components/NoteInputModal';
import { TouchableWithoutFeedback } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NoteScreen = ({user, navigation}) => {
    const [greet, setGreet] = useState('Evening');
    const [modalVisible, setModalVisible] = useState(false);
    const [notes, setNotes] = useState([]);


    const findGreet = () => {
       const hrs = new Date().getHours();
       if(hrs === 0 || hrs < 12) return setGreet('Morning');
       if(hrs === 1 || hrs < 17) return setGreet;('Afternoon');
       setGreet('Evening');
    };

    const findNotes = async() => {
        const result = await AsyncStorage.getItem('notes');
        if (result !== null) setNotes(JSON.parse(result));
    }
    useEffect(() => {
        // AsyncStorage.clear() Untuk clear semua datanya
        findNotes();
        findGreet();
    }, []);

    const handleOnSubmit =  async (title, desc) => {
        const note = {id: Date.now(), title, desc, time: Date.now()};
        const updatedNotes = [...notes, note];
        setNotes(updatedNotes);
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes))
    };

    const openNote = (note) => {
        navigation.navigate('NoteDetail', {note});
    };

    return (
        <>
        <StatusBar barStyle='dark-content' backgroundColor='{colors.LIGHT}' />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Text style={styles.header}>{'Good ${greet} ${user.name}'}</Text>
                {notes.length ? <SearchBar containerStyle={{marginVertical: 15}} /> : null}

                <FlatList 
                    data={notes}
                    numColumns={2}
                    columnWrapperStyle={{justifyContent: 'space-between', marginBottom: 15,}}
                    keyExtractor={item => item.id.toString()} 
                    renderItem={({item}) => (
                        <Note onPress={() => openNote(item)} item={item} />
                    )}
                />

                {!notes.length ? <View style={[StyleSheet.absoluteFillObject, styles.emptyHeaderContainer]}>
                    <Text style={styles.emptyHeader}>Add Notes</Text>
                    
                </View> : null}
            </View>
        </TouchableWithoutFeedback>
        <RoundIconBtn onPresss={() => setModalVisible(true)} antIconName='plus' style={styles.addBtn} />
        <NoteInputModal visible={modalVisible} onClose={() => setModalVisible(false)} onSubmit={handleOnSubmit} />
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: 35,
        color: colors.PRIMARY,
        fontWeight: 'bold',
    },
    container: {
        paddingHorizontal: 20,
        flex: 1,
        zIndex: 1,
    },
    emptyHeaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -1,
    },
    emptyHeader: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        zIndex: -1,
    },
    addBtn: {
        position: 'absolute',
        bottom: 15,
        right: 50,
        zIndex: 1,
    },
})

export default NoteScreen;
