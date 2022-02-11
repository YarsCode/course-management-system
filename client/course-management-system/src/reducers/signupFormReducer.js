import _ from 'lodash';

import signupFormTypes from '../action-types/signupFormTypes';
import { areValuesValid, areValueValiditiesValid } from '../utils/formUtils';

export const SIGNUP_FORM_INITIAL_STATE = {
    values: {
        name:'',
        email: '',
        password: '',
        repeatedPassword: '',
    },
    validities: {
        isNameValid: true,
        isEmailValid: true,
        isPasswordValid: true,
        isRepeatedPasswordValid: true
    },
    errorMessages: {
        nameErrorMessage: '',
        emailErrorMessage: '',
        passwordErrorMessage: '',
        repeatedPasswordErrorMessage: '',
    },
    isFormValid: false,
}

const signupFormReducer = (state, action) => {
    switch(action.type) {
        case signupFormTypes.UPDATE_NAME: {
            const { value, isValid, errorMessage } = action.payload;

            const updatedValues = { ..._.cloneDeep(state.values), name: value };
            const updatedValidities = { ..._.cloneDeep(state.validities), isNameValid: isValid };
            const updatedErrorMessages = { ..._.cloneDeep(state.errorMessages), nameErrorMessage: errorMessage };
            const updatedFormValidity = areValuesValid(updatedValues) && areValueValiditiesValid(updatedValidities);

            return { values: updatedValues, validities: updatedValidities, errorMessages: updatedErrorMessages, isFormValid: updatedFormValidity };
        }
        case signupFormTypes.UPDATE_EMAIL: {
            const { value, isValid, errorMessage } = action.payload;

            const updatedValues = { ..._.cloneDeep(state.values), email: value };
            const updatedValidities = { ..._.cloneDeep(state.validities), isEmailValid: isValid };
            const updatedErrorMessages = { ..._.cloneDeep(state.errorMessages), emailErrorMessage: errorMessage };
            const updatedFormValidity = areValuesValid(updatedValues) && areValueValiditiesValid(updatedValidities);

            return { values: updatedValues, validities: updatedValidities, errorMessages: updatedErrorMessages, isFormValid: updatedFormValidity };
        }
        case signupFormTypes.UPDATE_PASSWORD: {
            const { value, isValid, errorMessage } = action.payload;

            const updatedValues = { ..._.cloneDeep(state.values), password: value };
            const updatedValidities = { ..._.cloneDeep(state.validities), isPasswordValid: isValid };
            const updatedErrorMessages = { ..._.cloneDeep(state.errorMessages), passwordErrorMessage: errorMessage };
            const updatedFormValidity = areValuesValid(updatedValues) && areValueValiditiesValid(updatedValidities);

            return { values: updatedValues, validities: updatedValidities, errorMessages: updatedErrorMessages, isFormValid: updatedFormValidity };
        }
        case signupFormTypes.UPDATE_REPEATED_PASSWORD: {
            const { value, isValid, errorMessage } = action.payload;

            const updatedValues = { ..._.cloneDeep(state.values), repeatedPassword: value };
            const updatedValidities = { ..._.cloneDeep(state.validities), isRepeatedPasswordValid: isValid };
            const updatedErrorMessages = { ..._.cloneDeep(state.errorMessages), repeatedPasswordErrorMessage: errorMessage };
            const updatedFormValidity = areValuesValid(updatedValues) && areValueValiditiesValid(updatedValidities);

            return { values: updatedValues, validities: updatedValidities, errorMessages: updatedErrorMessages, isFormValid: updatedFormValidity };
        }
        default: 
            return _.cloneDeep(state);
    }
}

export default signupFormReducer;