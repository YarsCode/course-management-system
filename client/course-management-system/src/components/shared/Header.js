import React from "react";
import { Link } from "react-router-dom";
import logo from "../../styles/img/logo/CMS.png";
// import MobileNav from "./MobileNav";
// import Button from './Button'

const Header = (props) => {

    return (
        <header>
            <Link to="/"><img className="CMS-logo" src={logo} alt="CMS" /></Link>
            
            <button className="hamburger-menu-btn" onClick={props.handleHamburgerMenuClick}>
                <span></span>
                <span></span>
                <span></span>
            </button>
        </header>
    );
};

export default Header;
