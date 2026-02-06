import Input from "@/parts/Input";
import { useRef } from "react";
import "@/style/css/page_css/register.css";
import Form from "@/modules/Form";
import moon from "@/style/images/moon.png";

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Register() {

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
        <div id="Register">
            <div className="register-container" >
                <div className="img-container" data-aos="zoom-in" data-aos-duration="800" data-aos-delay="200">
                    <img src={moon} alt="moon" />
                </div>
                <div className="form-container">
                    <div className="form-content" data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
                        <p className="brand" data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">Inseptum</p>
                        <h1>Регистрация</h1>
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
                                type="password"
                                title="password"
                                placeholder="Повторите пароль"
                                name="confirm_password"
                            />
                            <Input
                                type="submit"
                                title="submit"
                                value="Зарегистрироваться"
                            />
                        </Form>
                    </div>
                    <div className="link-container" data-aos="fade-up" data-aos-duration="800" data-aos-delay="600">
                        <p>Уже зарегистрированы? <a href="/login">Войти</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;