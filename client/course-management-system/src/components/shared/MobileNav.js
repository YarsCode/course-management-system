import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { logoutAction } from "../../actions/loginActions";
import { LoginContext } from "../../context/LoginContext";
import { deleteUserFromCookie } from "../../cookies/cookies";
import ButtonMain from "./ButtonMain";

const MobileNav = ({ closeMobileNav }) => {
    const { userData, dispatchUserData } = useContext(LoginContext);

    const handleLogout = () => {
        dispatchUserData(logoutAction());
        closeMobileNav();
        deleteUserFromCookie();
    };

    return (
        <nav className="mobile-nav">
            {!userData.professor && !userData.student ? (
                <div className="mobile-nav__links">
                    <Link to="/login" onClick={closeMobileNav}>
                        <ButtonMain bgColor="#FCF7F8" text="Login/Sign-Up" />
                    </Link>
                </div>
            ) : (
                <div className="mobile-nav__links">
                    {userData.professor ? (
                        <>
                            <Link to="/professor-manage-courses" onClick={closeMobileNav}>
                                <ButtonMain bgColor="#FCF7F8" text="Manage Courses" />
                            </Link>
                            <Link to="/professor-account-settings" onClick={closeMobileNav}>
                                <ButtonMain bgColor="#FCF7F8" text="Account Settings" />
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/manage-class-attendance" onClick={closeMobileNav}>
                                <ButtonMain bgColor="#FCF7F8" text="Manage Class Attendance" />
                            </Link>
                            <Link to="/student-account-settings" onClick={closeMobileNav}>
                                <ButtonMain bgColor="#FCF7F8" text="Account Settings" />
                            </Link>
                        </>
                    )}

                    <Link to="/" onClick={handleLogout}>
                        <ButtonMain bgColor="#FCF7F8" text="Logout" />
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default MobileNav;
