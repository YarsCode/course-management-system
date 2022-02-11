import React, { useState } from "react";
import { Link } from "react-router-dom";
import useWindowDimensions from "../../hooks/useWindowDimenstions";
import logo from "../../styles/img/logo/CMS.png";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
// import Button from './Button'

const Header = () => {
    const { height, width } = useWindowDimensions();
    const [isHamburgerMenuClicked, setIsHamburgerMenuClicked] = useState(false);

    const handleHamburgerMenuClick = () => {
        setIsHamburgerMenuClicked(!isHamburgerMenuClicked);
    };

    return (
        <header>
            <Link to="/" className="CMS-logo-container">
                <img className="CMS-logo" src={logo} alt="CMS" />
            </Link>
            {width < 752 ? (
                <div className="hamburger-and-mobilenav-wrapper">
                    <button className="hamburger-menu-btn" onClick={handleHamburgerMenuClick}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    {isHamburgerMenuClicked && (
                        <MobileNav
                            handleHamburgerMenuClick={handleHamburgerMenuClick}
                            closeMobileNav={handleHamburgerMenuClick}
                        />
                    )}
                </div>
            ) : (
                <DesktopNav />
            )}

            {/* <div className="hamburger-and-mobilenav-wrapper">
                {width < 752 && (
                    <button className="hamburger-menu-btn" onClick={handleHamburgerMenuClick}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                )}
                {width < 752 ? isHamburgerMenuClicked && (
                    <MobileNav
                        handleHamburgerMenuClick={handleHamburgerMenuClick}
                        isHamburgerMenuClicked={isHamburgerMenuClicked}
                    />
                ) : <DesktopNav/>}
            </div> */}
        </header>
    );
};

export default Header;
