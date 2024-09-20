import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../misc/colors';

const RoundIconBtn = ({antIconName, size, color, style, onPress}) => {
    return (
        <AntDesign name={antIconName} size={size || 24} color={color || colors.LIGHT} style={[styles.icon, {...style}]} onPress={onPress} />
    );
};

const styles = StyleSheet.create({
    icon: {
        padding: 15,
        borderRadius: 50,
        backgroundColor: colors.PRIMARY,
        elevation: 5,
    },
});

export default RoundIconBtn;
