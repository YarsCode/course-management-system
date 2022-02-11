import _ from "lodash";

import loginFormTypes from "../action-types/loginFormTypes";
import { areValuesValid, areValueValiditiesValid } from "../utils/formUtils";

export const LOGIN_FORM_INITIAL_STATE = {
    values: {
        email: "",
        password: "",
    },
    validities: {
        isEmailValid: true,
        isPasswordValid: true,
    },
    errorMessages: {
        emailErrorMessage: "",
        passwordErrorMessage: "",
    },
    isFormValid: false,
};

const signupFormReducer = (state, action) => {
    switch (action.type) {
        case loginFormTypes.LOGIN_EMAIL: {
            const { value, isValid, errorMessage } = action.payload;

            const updatedValues = { ..._.cloneDeep(state.values), email: value };
            const updatedValidities = { ..._.cloneDeep(state.validities), isEmailValid: isValid };
            const updatedErrorMessages = { ..._.cloneDeep(state.errorMessages), emailErrorMessage: errorMessage };
            const updatedFormValidity = areValuesValid(updatedValues) && areValueValiditiesValid(updatedValidities);

            return {
                values: updatedValues,
                validities: updatedValidities,
                errorMessages: updatedErrorMessages,
                isFormValid: updatedFormValidity,
            };
        }
        case loginFormTypes.LOGIN_PASSWORD: {
            const { value, isValid, errorMessage } = action.payload;

            const updatedValues = { ..._.cloneDeep(state.values), password: value };
            const updatedValidities = { ..._.cloneDeep(state.validities), isPasswordValid: isValid };
            const updatedErrorMessages = { ..._.cloneDeep(state.errorMessages), passwordErrorMessage: errorMessage };
            const updatedFormValidity = areValuesValid(updatedValues) && areValueValiditiesValid(updatedValidities);

            return {
                values: updatedValues,
                validities: updatedValidities,
                errorMessages: updatedErrorMessages,
                isFormValid: updatedFormValidity,
            };
        }
        default:
            return _.cloneDeep(state);
    }
};

export default signupFormReducer;
