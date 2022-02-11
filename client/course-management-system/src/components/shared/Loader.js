import React from "react";

import loader from "../../styles/img/loaders/flipping-book-pages.gif";

const Loader = () => {
    return (
        <div className="loader-container">
            <img src={loader} alt=""/>
        </div>
    );
};

export default Loader;