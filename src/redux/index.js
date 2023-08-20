import { configureStore } from "@reduxjs/toolkit";
import loginReducer, { initialState } from "./slice/userAuthSlice";

const storedData = localStorage.getItem("userData");
const preloadedState = {
    login: { ...initialState, data: storedData ? JSON.parse(storedData) : [] },
};

// Reducers

export const store = configureStore({
    reducer: {
        login: loginReducer,
    },
    preloadedState,
});

