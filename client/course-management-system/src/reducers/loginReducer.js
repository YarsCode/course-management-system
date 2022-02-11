import _ from 'lodash';

import loginTypes from "../action-types/loginTypes";

export const userDataInitialState = { user: null, token: "" };

const loginReducer = (userData, action) => {
    switch (action.type) {
        case loginTypes.LOGIN:
            return _.omit(action, 'type');
        case loginTypes.LOGOUT:
            return { user: null, token: "" };
        default:
            return { ...userData };
    }
};

export default loginReducer;