import { useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ProfessorAccountSettings from "./components/account/ProfessorAccountSettings";
import StudentAccountSettings from "./components/account/StudentAccountSettings";
import ManageClassAttendance from "./components/student-attendance-management-interface/ManageClassAttendance";

import ManageCourses from "./components/professor-management-interface/ManageCourses";
import Homepage from "./components/home/Homepage";
import Login from "./components/login/Login";
import Error404Page from "./components/shared/Error404Page";
import Footer from "./components/shared/Footer";
import Header from "./components/shared/Header";
import MobileNav from "./components/shared/MobileNav";
import ClassesWithStudentContextProvider from "./context/ClassesWithStudentContext";
import CoursesContextProvider from "./context/CoursesContext";
import LoginContextProvider from "./context/LoginContext";
import ProfessorsContextProvider from "./context/ProfessorsContext";
import StudentsContextProvider from "./context/StudentsContext";
import Loader from "./components/shared/Loader";
import PrivateRouteProfessor from "./routers/PrivateRouteProfessor";
import PrivateRouteStudent from "./routers/PrivateRouteStudent";
import useWindowDimensions from "./hooks/useWindowDimenstions";
import DesktopNav from "./components/shared/DesktopNav";
import About from "./components/shared/About";
import ContactUs from "./components/shared/ContactUs";

// import LoginRoute from "./routers/LoginRoute";

function App() {

    return (
        <BrowserRouter>
            <LoginContextProvider>
                <Header />
                {/* {isHamburgerMenuClicked && <MobileNav closeMobileNav={handleHamburgerMenuClick} />} */}
                {/* {width >= 720 ? <DesktopNav/> : isHamburgerMenuClicked && <MobileNav closeMobileNav={handleHamburgerMenuClick} />} */}
                <Switch>
                    <Route path="/" component={Homepage} exact />
                    <Route path="/login" component={Login} />
                    <Route path="/about" component={About} />
                    <Route path="/contact-us" component={ContactUs} />
                    <PrivateRouteProfessor path="/professor-account-settings" component={ProfessorAccountSettings} />
                    <PrivateRouteStudent path="/student-account-settings" component={StudentAccountSettings} />
                    <Route path="/loader" component={Loader} />
                    {/* <ClassesWithStudentContextProvider>
                        <PrivateRouteStudent path="/manage-class-attendance" component={ManageClassAttendance} />
                    </ClassesWithStudentContextProvider> */}
                    <CoursesContextProvider>
                        <ProfessorsContextProvider>
                            <StudentsContextProvider>
                                <PrivateRouteProfessor path="/professor-manage-courses" component={ManageCourses} />
                            </StudentsContextProvider>
                        </ProfessorsContextProvider>
                    </CoursesContextProvider>

                    <Route path="*" component={Error404Page} />
                </Switch>

                <Footer />
            </LoginContextProvider>
        </BrowserRouter>
    );
}

export default App;

// router.js
// const routes = [{
//     path: '/', component: Homepage, exact: true
// }, {
//     path: '/login',
// }];

// const Router = () => {
//     return (
//         <BrowserRouter>
//             {routes.map(route => <Route {...route} />)}
//         </BrowserRouter>
//     )

// }
