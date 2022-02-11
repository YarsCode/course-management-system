import loginTypes from "../action-types/loginTypes";

export const loginAction = (params) => ({
    type: loginTypes.LOGIN,
    ...params
});

export const logoutAction = () => ({
    type: loginTypes.LOGOUT
});