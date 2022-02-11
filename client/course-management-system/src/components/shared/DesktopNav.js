import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { logoutAction } from "../../actions/loginActions";
import { LoginContext } from "../../context/LoginContext";
import { deleteUserFromCookie } from "../../cookies/cookies";
import ButtonMain from "./ButtonMain";

const DesktopNav = () => {
    const { userData, dispatchUserData } = useContext(LoginContext);

    const handleLogout = () => {
        dispatchUserData(logoutAction());
        deleteUserFromCookie();
    };

    return (
        <nav className="desktop-nav">
            {!userData.professor && !userData.student ? (
                <div className="desktop-nav__links">
                    <Link to="/login">
                        <ButtonMain bgColor="#FFA62B" text="Login/Sign-Up" />
                    </Link>
                </div>
            ) : (
                <div className="desktop-nav__links">
                    {userData.professor ? (
                        <>
                            <Link to="/professor-manage-courses">
                                <ButtonMain bgColor="#FFA62B" text="Manage Courses" />
                            </Link>
                            <Link to="/professor-account-settings">
                                <ButtonMain bgColor="#FFA62B" text="Account Settings" />
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/manage-class-attendance">
                                <ButtonMain bgColor="#FFA62B" text="Manage Class Attendance" />
                            </Link>
                            <Link to="/student-account-settings">
                                <ButtonMain bgColor="#FFA62B" text="Account Settings" />
                            </Link>
                        </>
                    )}

                    <Link to="/" onClick={handleLogout}>
                        <ButtonMain bgColor="#FFA62B" text="Logout" />
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default DesktopNav;