import _ from 'lodash';

import studentEditTypes from '../action-types/studentEditTypes';
import { areValuesValid, areValueValiditiesValid } from '../utils/formUtils';

export const EDIT_FORM_INITIAL_STATE = {
    values: {
        name:'',
        dateOfBirth:'',
        address:'',
        email: '',
        password: '',
        repeatedPassword: '',
    },
    validities: {
        isNameValid: true,
        isDateOfBirthValid: true,
        isAddressValid: true,
        isEmailValid: true,
        isPasswordValid: true,
        isRepeatedPasswordValid: true
    },
    errorMessages: {
        nameErrorMessage: '',
        dateOfBirthErrorMessage: '',
        addressErrorMessage: '',
        emailErrorMessage: '',
        passwordErrorMessage: '',
        repeatedPasswordErrorMessage: '',
    },
    isFormValid: false,
}

const signupFormReducer = (state, action) => {
    switch(action.type) {
        case studentEditTypes.EDIT_NAME: {
            const { value, isValid, errorMessage } = action.payload;

            const updatedValues = { ..._.cloneDeep(state.values), name: value };
            const updatedValidities = { ..._.cloneDeep(state.validities), isNameValid: isValid };
            const updatedErrorMessages = { ..._.cloneDeep(state.errorMessages), nameErrorMessage: errorMessage };
            const updatedFormValidity = areValuesValid(updatedValues) && areValueValiditiesValid(updatedValidities);

            return { values: updatedValues, validities: updatedValidities, errorMessages: updatedErrorMessages, isFormValid: updatedFormValidity };
        }
        case studentEditTypes.EDIT_BIRTHDATE: {
            const { value, isValid, errorMessage } = action.payload;

            const updatedValues = { ..._.cloneDeep(state.values), dateOfBirth: value };
            const updatedValidities = { ..._.cloneDeep(state.validities), isDateOfBirthValid: isValid };
            const updatedErrorMessages = { ..._.cloneDeep(state.errorMessages), dateOfBirthErrorMessage: errorMessage };
            const updatedFormValidity = areValuesValid(updatedValues) && areValueValiditiesValid(updatedValidities);

            return { values: updatedValues, validities: updatedValidities, errorMessages: updatedErrorMessages, isFormValid: updatedFormValidity };
        }
        case studentEditTypes.EDIT_ADDRESS: {
            const { value, isValid, errorMessage } = action.payload;

            const updatedValues = { ..._.cloneDeep(state.values), address: value };
            const updatedValidities = { ..._.cloneDeep(state.validities), isAddressValid: isValid };
            const updatedErrorMessages = { ..._.cloneDeep(state.errorMessages), addressErrorMessage: errorMessage };
            const updatedFormValidity = areValuesValid(updatedValues) && areValueValiditiesValid(updatedValidities);

            return { values: updatedValues, validities: updatedValidities, errorMessages: updatedErrorMessages, isFormValid: updatedFormValidity };
        }
        case studentEditTypes.EDIT_EMAIL: {
            const { value, isValid, errorMessage } = action.payload;

            const updatedValues = { ..._.cloneDeep(state.values), email: value };
            const updatedValidities = { ..._.cloneDeep(state.validities), isEmailValid: isValid };
            const updatedErrorMessages = { ..._.cloneDeep(state.errorMessages), emailErrorMessage: errorMessage };
            const updatedFormValidity = areValuesValid(updatedValues) && areValueValiditiesValid(updatedValidities);

            return { values: updatedValues, validities: updatedValidities, errorMessages: updatedErrorMessages, isFormValid: updatedFormValidity };
        }
        case studentEditTypes.EDIT_PASSWORD: {
            const { value, isValid, errorMessage } = action.payload;

            const updatedValues = { ..._.cloneDeep(state.values), password: value };
            const updatedValidities = { ..._.cloneDeep(state.validities), isPasswordValid: isValid };
            const updatedErrorMessages = { ..._.cloneDeep(state.errorMessages), passwordErrorMessage: errorMessage };
            const updatedFormValidity = areValuesValid(updatedValues) && areValueValiditiesValid(updatedValidities);

            return { values: updatedValues, validities: updatedValidities, errorMessages: updatedErrorMessages, isFormValid: updatedFormValidity };
        }
        case studentEditTypes.EDIT_REPEATED_PASSWORD: {
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