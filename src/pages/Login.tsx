import Input from "@/parts/Input";
import { useRef } from "react";
import "@/style/css/page_css/login.css";
import Form from "@/modules/Form";
import sum from "@/style/images/sun.png";

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Login() {

    useEffect(() => {
            AOS.init({
                duration: 1000,
                easing: 'ease-out-quart',
                once: true,
                offset: 100,
                delay: 0,
            });
        }, []);

    return (
        <div id="Login">
            <div className="login-container">
                <div className="img-container" data-aos="zoom-in" data-aos-duration="800" data-aos-delay="200">
                    <img src={sum} alt="sun" />
                </div>
                <div className="form-container">
                    <div className="form-content" data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
                        <p className="brand" data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">Inseptum</p>
                        <h1>Вход</h1>
                        <h2 className="error"></h2>
                        
                        <Form>
                            <Input 
                                type="text" 
                                title="text" 
                                placeholder="Введите ваше имя" 
                                name="username"
                            />
                            <Input 
                                type="password" 
                                title="password" 
                                placeholder="Введите пароль" 
                                name="password"
                            />
                            <Input 
                                type="submit" 
                                title="submit" 
                                value="Войти"
                            />
                        </Form>
                        
                        <div className="link-container" data-aos="fade-up" data-aos-duration="800" data-aos-delay="600">
                            <p>Еще не зарегистрированы? <a href="/register">Зарегистрироваться</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;