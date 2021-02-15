import React, { useEffect, useRef, useState } from "react";
import { Text, View, AppState, AppStateStatus } from "react-native";
import moment from "moment";
import LastSeenComponentStyle from "./LastSeenComponent.style";

export interface LastSeenProps {
    lastSeen: number;
}

const LastSeenComponent: React.FC<LastSeenProps> = (props: LastSeenProps) => {

    const appState = useRef(AppState.currentState);
    const lastSeenRef = useRef(props.lastSeen);

    const [lastSeenLabel, setLastSeenLabel] = useState<string>("");

    let LastSeentimer: ReturnType<typeof setTimeout>;

    useEffect(() => {
        AppState.addEventListener("change", handleAppState);
        return () => {
            stopTimer();
            AppState.removeEventListener("change", handleAppState);
        };
    }, []);

    useEffect(() => {
        lastSeenRef.current = props.lastSeen;
        stopTimer();
        startTimer();
    }, [props.lastSeen]);

    const handleAppState = (nextState: AppStateStatus): void => {
        if (appState.current.match(/inactive|background/) && nextState === "active") {
            startTimer();
        }
        if (appState.current === "active" && nextState.match(/inactive|background/)) {
            stopTimer();
        }
        appState.current = nextState;
    };

    const startTimer = (): void => {
        formatTimestamp(moment().unix() - lastSeenRef.current);
    };

    const refreshTimer = (delay: number) => {
        LastSeentimer = setTimeout(Tick, delay);
    };

    const stopTimer = (): void => {
        if (LastSeentimer) clearTimeout(LastSeentimer);
    };

    const Tick = (): void => {
        let currenttDif: number = moment().unix() - lastSeenRef.current;
        formatTimestamp(currenttDif);
    };

    const getDelay = (secondsToFullMinute: number): number => (60 - secondsToFullMinute) * 1000;

    const formatTimestamp = (diff: number): void => {
        if (diff < 60) {
            let seconds = diff % 60;
            setLastSeenLabel(`${ seconds } seconds ago`);
            refreshTimer(1000);
        } else {
            let minutes = Math.floor(diff / 60);
            let restOfMinute = diff % 60;
            setLastSeenLabel(`${ minutes } minutes ago`);
            refreshTimer(getDelay(restOfMinute));
        }
    };

    return (
        <View style={ LastSeenComponentStyle.container }>
            <Text style={ LastSeenComponentStyle.label }>{ "Last visit:" }</Text>
            <Text style={ LastSeenComponentStyle.timeLabel }>{ lastSeenLabel }</Text>
        </View>
    );
};


export default LastSeenComponent;
