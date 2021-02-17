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
    const lastSeenTimer = useRef<ReturnType<typeof setTimeout>>();

    const [lastSeenLabel, setLastSeenLabel] = useState<string>("");

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
        Tick();
    }, [props.lastSeen]);

    const handleAppState = (nextState: AppStateStatus): void => {
        if (appState.current.match(/inactive|background/) && nextState === "active") {
            Tick();
        }
        if (appState.current === "active" && nextState.match(/inactive|background/)) {
            stopTimer();
        }
        appState.current = nextState;
    };

    const refreshTimer = (delay: number) => {
        lastSeenTimer.current = setTimeout(Tick, delay);
    };

    const stopTimer = (): void => {
        if (lastSeenTimer.current) clearTimeout(lastSeenTimer.current);
    };

    const Tick = (): void => {
        formatTimestamp(moment().unix() - lastSeenRef.current);
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
