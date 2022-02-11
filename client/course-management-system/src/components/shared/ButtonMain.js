import React from 'react'

const ButtonMain = ({type = "button", bgColor, text, width, padding, color, disabled = false, onKeyPress, handleButtonClick}) => {
    return (
        <button className='btn-primary' type={type} style={{backgroundColor: bgColor, width, color, padding}} disabled={disabled} onKeyPress={onKeyPress} onClick={handleButtonClick}>
            {text}
        </button>
    )
}

export default ButtonMain
