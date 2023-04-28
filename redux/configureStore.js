import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk';
import { excursiones } from './excursiones';

export const ConfigureStore = () => {
    const store = configureStore({
        reducer: {
            excursiones: excursiones,
        },
        middleware: [thunk],
    });

    return store;
}