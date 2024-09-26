import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import {useHeaderHeight} from '@react-navigation/stack';
import colors from '../misc/colors';
import RoundIconBtn from './RoundIconBtn';


const formatDate = ms => {
    const date = new Date(ms)
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hr = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();

    return '${day}/${month}/${year} ${hr}:${min}:${sec}';
}

const NoteDetail = props => {
    const {note} = props.route.params;
    const headerHeight = useHeaderHeight();

    return (
        <>
            <ScrollView contentContainerStyle={[styles.container, {paddingTop: headerHeight}]}>
                <Text style={styles.time}>{'Created at ${formatDate(note.time)}'}</Text>
                <Text style={styles.title}>{note.title}</Text>
                <Text style={styles.desc}>{note.desc}</Text>
            </ScrollView>
            <View style={styles.btnContainer}>
                <RoundIconBtn antIconName='delete' style={{backgroundColor: colors.ERROR, marginBottom: 15}} onPress={() => console.log('deleting note')} />
                <RoundIconBtn antIconName='edit' onPress={() => console.log('editing note')} />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        paddingHorizontal: 15,
    },
    title: {
        fontSize: 30,
        color: colors.PRIMARY,
        fontWeight: 'bold',
    },
    desc: {
        fontSize: 20,
        opacity: 0.6,
    },
    time: {
        textAlign: 'right',
        fontSize: 10,
        opacity: 0.5,
    },
    btnContainer: {
        position: 'absolute',
        right: 15,
        bottom: 15,
    }
})

export default NoteDetail;
