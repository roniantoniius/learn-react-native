import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Modal, Text, TextInput, StatusBar, Keyboard } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-web';
import RoundIconBtn from './RoundIconBtn';
import colors from '../misc/colors';

const NoteInputModal = ({visible, onClose, onSubmit}) => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const handleModalClose = () => {
        Keyboard.dismiss();
    };

    const handleOnChangeText = (text, valueFor) => {
        if (valueFor === 'title') setTitle(text);
        if (valueFor === 'desc') setDesc(text);
    };

    const handleSubmit = () => {
        if (!title.trim() && !desc.trim()) return onclose();
        onsubmit(title, desc);
        setTitle('');
        setDesc('');
        onClose();
    };

    const closeModal = () => {
        setTitle('');
        setDesc('');
        onClose();
    }
    return (
    <>
        <StatusBar hidden />
        <Modal visible={visible} animationType='fade'>
            <View style={styles.container}>
            
                <TextInput value={title} onChangeText={(text) => handleOnChangeText(text, 'title')} placeholder='Title' style={[styles.input, styles.title]} />
                <TextInput value={desc} multiline placeholder='Note' style={[styles.input, styles.desc]} onChangeText={(text) => handleOnChangeText(text, 'desc')} />

                <View style={styles.btnContainer}>
                    <RoundIconBtn size={15} antIconName='check' onPress={handleSubmit} />

                    {title.trim() || desc.trim() ?
                        <RoundIconBtn 
                            size={15} 
                            style={{marginLeft: 15}} 
                            antIconName='close'
                            onPress={closeModal}
                        /> : null}

                </View>
            </View>
            <TouchableWithoutFeedback onPress={handleModalClose}>
                <View style={[styles.modalBG, StyleSheet.absoluteFillObject]} />
            </TouchableWithoutFeedback>
        </Modal>
    </>
    );
};

const styles = StyleSheet.create({
    input: {
        borderBottomWidth: 2,
        borderBottomColor: colors.PRIMARY,
        fontSize: 20,
        color: colors.DARK,
    },
    container: {
        paddingHorizontal: 20,
        paddingTop: 15,
    },
    title: {
        height: 40,
        marginBottom: 15,
        fontWeight: 'bold',
    },
    desc: {
        height: 100,
    },
    modalBG: {
        flex: 1,
        zIndex: -1,
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 15,
    }

})

export default NoteInputModal;
