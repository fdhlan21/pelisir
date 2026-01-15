import React from 'react';
import { StyleSheet, Text, View ,ActivityIndicator} from 'react-native';

import { colors } from '../utils/colors';

export default function MyLoading({ type = 'ThreeBounce', color = colors.primary }) {
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', }}>
            <ActivityIndicator size="large" color={color} />
        </View>
    );
}

const styles = StyleSheet.create({});
