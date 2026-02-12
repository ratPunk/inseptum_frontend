import Link from "@/parts/link";
import "@/style/css/modules_css/header.css";
import logo from "../style/svg/logo.svg"
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import userDataRespose from "@/types/userDatarespose";
import { IoExit } from "react-icons/io5";
import user1 from "@/style/svg/user1.svg";

function Header() {
    const location = useLocation();
    const [user, setUser] = useState<userDataRespose | null>(null);


    useEffect(() => {
        const storeduser = localStorage.getItem('user');
        if(storeduser !== null){
            setUser(JSON.parse(storeduser));
        }
    }, [])

    return (
        <header id="Header" >
            <div className="header-container">
                <div className="logo">
                    {/* <img src={logo} alt="logo" /> */}
                    <h1 className="logo-text">Inseptum</h1>
                </div>
                <nav className="nav">
                    <Link href="/home" text="Главная" className={`header-link ${location.pathname === "/home" ? "link-active" : ""}`} />
                    <Link href="/modules" text="Модули" className={`header-link ${location.pathname === "/modules" ? "link-active" : ""}`} />
                    <Link href="/" text="Темы" className={`header-link ${location.pathname === "/articles" ? "link-active" : ""}`} />
                    <Link href="/articles" text="Статьи" className={`header-link ${location.pathname === "/articles" ? "link-active" : ""}`} />
                    <Link href="/" text="Тесты" className="header-link" />
                    <Link href="/" text="Задачи" className="header-link" />
                </nav>
                <div className="user-actions">
                    {user ? (
                        <>
                        <Link href="/profile" image={user1} imageStyle="user-icon small-user-icon" />
                        <Link href="/profile" text={user.username} className="header-user-name" /> 
                        |
                        <Link href="/profile" text="Выход" className="exit" icon={IoExit}/>
                        </>
                    ) : (
                        <>
                            <Link href="/login" text="Войти" className="auth" />
                            <Link href="/register" text="Зарегестрироваться" className="register" />
                        </>
                    )}

                </div>
            </div>
        </header>
    )
}

export default Header;