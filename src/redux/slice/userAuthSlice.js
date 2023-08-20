import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    isLoading: false,
    data: [],
};

export const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        loginSuccess: (state, { payload }) => {
            state.isLoading = false;
            state.data = payload.data;
            localStorage.setItem("userData", JSON.stringify(payload.data));
        },
    },
});

export const { loginSuccess } = loginSlice.actions;

export default loginSlice.reducer;
