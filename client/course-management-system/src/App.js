import { useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Homepage from "./components/home/Homepage";
import Login from "./components/login/Login";
import Error404Page from "./components/shared/Error404Page";

import Footer from "./components/shared/Footer";
import Header from "./components/shared/Header";
import MobileNav from "./components/shared/MobileNav";

function App() {
    const [isHamburgerMenuClicked, setIsHamburgerMenuClicked] = useState(false);

    const handleHamburgerMenuClick = () => {
        setIsHamburgerMenuClicked(!isHamburgerMenuClicked);
    };

    return (
        // <div>
        <BrowserRouter>
            <Header handleHamburgerMenuClick={handleHamburgerMenuClick} />
            {isHamburgerMenuClicked && <MobileNav closeMobileNav={handleHamburgerMenuClick}/>}
            <Switch>
                <Route path="/" component={Homepage} exact/>
                <Route path="/login" component={Login}/>

                <Route path="*" component={Error404Page}/>
            </Switch>

            <Footer />
        </BrowserRouter>
        // </div>
    );
}

export default App;
