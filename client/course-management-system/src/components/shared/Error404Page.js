import React from 'react'

import errorImg from "../../styles/img/error-page/empty-book.png";

const Error404Page = () => {
    return (
        <main className='error404-container'>
            <h1>404: Page Not Found</h1>
            <img src={errorImg} alt="Nothing to see here" />
            <h2>Sorry, the page you were looking for doesn't exist</h2>
        </main>
    )
}

export default Error404Page
