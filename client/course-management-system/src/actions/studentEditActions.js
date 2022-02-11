export const updateInputAction = (type, value, isValid, errorMessage = '') => ({
    type,
    payload: {
        value,
        isValid,
        errorMessage
    }
})