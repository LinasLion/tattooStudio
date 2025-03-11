import logo from "../assets/img/logo.png";
import HeaderButton from "./HeaderButton";
import {useAuth} from "../contexts/authContext";
import {useLocation} from "react-router-dom";

export function Header() {
    const {isAuthenticated, logout} = useAuth();
    const location = useLocation();
    const currentPath = location.pathname;

    const handleLogOut = () => {
        logout();
    }

    return (
        <header className="header-navigation">
            <img
                src={logo}
                className="header-navigation__logo"
                alt="studio logotype"
            />
            <ul className="header-navigation__menu">
                <li>
                    <HeaderButton
                        path="/home"
                        title="Home"
                        className={`header-navigation__menu__link ${currentPath === "/home" ? "active-nav" : ""}`}
                    />
                </li>
                <li>
                    <HeaderButton
                        path="/studio"
                        title="Studio"
                        className={`header-navigation__menu__link ${currentPath === "/studio" ? "active-nav" : ""}`}
                    />
                </li>
                <li>
                    <HeaderButton
                        path="/gallery"
                        title="Gallery"
                        className={`header-navigation__menu__link ${currentPath === "/gallery" ? "active-nav" : ""}`}
                    />
                </li>
                <li>
                    <HeaderButton
                        path="/posts"
                        title="Posts"
                        className={`header-navigation__menu__link ${currentPath === "/posts" ? "active-nav" : ""}`}
                    />
                </li>
                {isAuthenticated ? (
                    <li>
                        <HeaderButton
                            path="/home"
                            onClick={handleLogOut}
                            title="Logout"
                            className="header-navigation__menu__link"
                        />
                    </li>
                ) : (
                    <li>
                        <HeaderButton
                            path="/login"
                            title="Login"
                            className={`header-navigation__menu__link ${currentPath === "/login" ? "active-nav" : ""}`}
                        />
                    </li>
                )}
            </ul>
        </header>
    );
}