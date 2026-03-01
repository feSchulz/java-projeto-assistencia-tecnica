
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess(state, action) {
            state.user = action.payload;
            // se quiser, também pode colocar o token aqui
        },
        logout(state) {
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
