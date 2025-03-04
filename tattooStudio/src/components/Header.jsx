import logo from "../assets/img/logo.png";
import HeaderButton from "./HeaderButton";

export function Header() {
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
                        className="header-navigation__menu__link"
                    />
                </li>
                <li>
                    <HeaderButton
                        path="/studio"
                        title="Studio"
                        className="header-navigation__menu__link"
                    />
                </li>
                <li>
                    <HeaderButton
                        path="/gallery"
                        title="Gallery"
                        className="header-navigation__menu__link"
                    />
                </li>
                <li>
                    <HeaderButton
                        path="/posts"
                        title="Posts"
                        className="header-navigation__menu__link"
                    />
                </li>
                <li>
                    <HeaderButton
                        path="/login"
                        title="Login"
                        className="header-navigation__menu__link"
                    />
                </li>
            </ul>
        </header>
    );
}
