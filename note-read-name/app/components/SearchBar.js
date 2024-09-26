import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import colors from '../misc/colors';

const SearchBar = ({containerStyle}) => {
    return (
        <View style={[styles.container, {...containerStyle}]}>
            <TextInput style={styles.SearchBar} placeholder='Search here..' />
        </View>
    );
}

const styles = StyleSheet.create({
    SearchBar: {
        borderColor: colors.PRIMARY,
        borderWidth: 1,
        height: 40,
        borderRadius: 40,
        paddingLeft: 15,
        fontSize: 18,
    },
    container: {}
})

export default SearchBar;
