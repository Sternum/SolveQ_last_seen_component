/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    StatusBar, Button
} from "react-native";

import moment from "moment";
import LastSeenComponent from "./LastSeenComponent/LastSeenComponent";


declare const global: { HermesInternal: null | {} };

const App = () => {
    const [lastSeen, setLastSeen] = useState<number>(moment().unix());

    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={ styles.container }>
                <LastSeenComponent lastSeen={ lastSeen } />
                <Button title={ "Reset last seen" } onPress={ () => setLastSeen(moment().unix()) } />
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default App;
