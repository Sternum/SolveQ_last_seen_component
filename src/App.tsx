import React, { useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    StatusBar, Button
} from "react-native";
import moment from "moment";
import LastSeenComponent from "./LastSeenComponent/LastSeenComponent";

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
