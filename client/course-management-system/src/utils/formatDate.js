const dayjs = require("dayjs");

const formatDate = (date, dateFormat) => {
    const formatedDate = dayjs(date).format(dateFormat);

    return formatedDate;
};

const calculateAge = (birthdate, currentDate) => {
    birthdate = dayjs(birthdate);
    currentDate = dayjs(currentDate);

    return currentDate.diff(birthdate, "y", true);
};

module.exports = { formatDate, calculateAge };
