export const areValuesValid = (values) => {
    for (let key of Object.keys(values)) if (values[key] === null || values[key] === '') return false;

    return true;
}

export const areValueValiditiesValid = (validites) => {
    for (let key of Object.keys(validites)) if (validites[key] === false) return false;

    return true;
}

export const setInvalidInputStyles = (isValid) => {
    if (isValid) {
        return {
            borderTop: "1px solid #D62839",
            borderRight: "1px solid #D62839",
            borderLeft: "1px solid #D62839",
            borderBottom: "4px solid #D62839",
            borderRadius: "6px"
        }
    }

    return {};
}