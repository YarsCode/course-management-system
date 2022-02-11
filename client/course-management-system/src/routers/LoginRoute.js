import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import { deleteUserFromCookie } from "../cookies/cookies";

const LoginRoute = ({ component: Component, ...rest }) => {
    const { userData } = useContext(LoginContext);
    console.log(userData);

    return (
        <Route
            {...rest}
            component={(props) =>
                !!userData.user ? (
                    <Redirect to={"/manage-courses"} />
                    ) : (
                    <Component {...props} />
                )
            }
        />
    );
};

export default LoginRoute;
