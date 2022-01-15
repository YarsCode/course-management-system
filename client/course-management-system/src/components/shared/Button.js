import React from 'react'

const Button = ({bgColor, text, width, color}) => {
    return (
        <button className='btn-primary' style={{backgroundColor: bgColor, width, color}}>
            {text}
        </button>
    )
}

export default Button
