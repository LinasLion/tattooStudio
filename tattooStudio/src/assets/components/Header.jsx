import logo from '../img/logo.png'

export function Header() {

    return(
        <header className={'header-navigation'}>
            <img src={logo} className={'header-navigation__logo'} alt="studio logotype"/>
            <ul className={'header-navigation__menu'}>
                <li><a href="" className={'header-navigation__menu__link'}>Home</a></li>
                <li><a href="" className={'header-navigation__menu__link'}>Studio</a></li>
                <li><a href="" className={'header-navigation__menu__link'}>Gallery</a></li>
                <li><a href="" className={'header-navigation__menu__link'}>Minds</a></li>
            </ul>
        </header>
    )
}



