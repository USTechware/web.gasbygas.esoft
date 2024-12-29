"use client"

import { Provider } from 'react-redux';
import { store } from './index';
import { getPersistor } from "@rematch/persist";
import { PersistGate } from "redux-persist/lib/integration/react";

const persistor = getPersistor();

export function StoreProvider({ children }: { children: React.ReactNode }) {
    return (
        <PersistGate persistor={persistor}>
            <Provider store={store}>{children}</Provider>
        </PersistGate>
    );
}