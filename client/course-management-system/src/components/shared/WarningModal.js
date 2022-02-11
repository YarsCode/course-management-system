import React from "react";

import stopSign from '../../styles/img/error-page/stop-sign.png'

const WarningModal = ({title, text}) => {
    return (
        <div className="warning-modal-container">
            <div className="warning-modal-content">
                <h2>{title}</h2>
                <img src={stopSign} alt="" />
                <p>{text}</p>
            </div>
        </div>
    );
};

export default WarningModal;