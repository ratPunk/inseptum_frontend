import Link from "@/parts/link";
import "@/style/css/modules_css/header.css";
import logo from "../style/svg/logo.svg"
import { useLocation } from "react-router-dom";


function Header() {
    const location = useLocation();


    return (
        <header id="Header" >
            <div className="header-container">
                <div className="logo">
                    {/* <img src={logo} alt="logo" /> */}
                    <h1 className="logo-text">Inseptum</h1>
                </div>
                <nav className="nav">
                    <Link href="/home" text="Главная" className={`header-link ${location.pathname === "/home" ? "active" : ""}`}/>
                    <Link href="/" text="Статьи" className="header-link"/>
                    <Link href="/" text="Тесты" className="header-link"/>
                    <Link href="/" text="Задачи" className="header-link"/>
                </nav>
                <div className="user-actions">
                    <Link href="/" text="Войти" className="auth"/>                    
                    <Link href="/" text="Зарегестрироваться" className="register"/>
                </div>
            </div>
        </header>
    )
}

export default Header;