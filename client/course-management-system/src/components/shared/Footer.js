import React from 'react'
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer>
            <Link to="/about">About</Link>
            <Link to="/contact-us">Contact Us</Link>
        </footer>
    )
}

export default Footer
