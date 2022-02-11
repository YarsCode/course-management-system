import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";

import { LoginContext } from "../context/LoginContext";

const PrivateRouteProfessor = ({ component: Component, ...rest }) => {
    const { userData } = useContext(LoginContext);

    return (
        <Route
            {...rest}
            component={(props) =>
                !!userData.professor ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: "/login", state: { needToLogin: true } }} />
                )
            }
        />
    );
};

export default PrivateRouteProfessor;
