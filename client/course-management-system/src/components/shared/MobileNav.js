import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

const MobileNav = ({ closeMobileNav }) => {
    return (
        <nav className="mobile-nav">
            <div className="mobile-nav__links">
                <Link to="/login" onClick={closeMobileNav}>
                    <Button bgColor="#FCF7F8" text="Login" />
                </Link>
                <Button bgColor="#FCF7F8" text="Manage Courses" />
                <Button bgColor="#FCF7F8" text="Account Settings" />
            </div>
            {/* <div>
                <Button bgColor="#f1faee" text="Login"/>
                <Button bgColor="#f1faee" text="Manage Courses"/>
                <Button bgColor="#f1faee" text="Account Settings"/>
            </div> */}
        </nav>
    );
};

export default MobileNav;
