import Input from "@/parts/Input";
import { useRef, useState } from "react";
import "@/style/css/page_css/register.css";
import Form from "@/modules/Form";
import moon from "@/style/images/moon.png";
import registerUser from "@/api/register"
import { SuccessResponse, ErrorResponse } from "@/types/response";

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import registerData from "@/types/registerData";

function Register() {
    const [error, setError] = useState('');
    const [form, setForm] = useState<registerData>(
        {
            username: '',
            password: '',
            confirm_password: ''
        }
    );

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirm_passwordRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };


    const handleSubmit = async (e: React.MouseEvent<HTMLInputElement>) => {
        e.preventDefault();
        try {
            const response: SuccessResponse | ErrorResponse = await registerUser(form);

            console.log('response: ', response);

            if (response.status === true) {
                console.log('Успешно ' + response);
                setError('');
                localStorage.setItem('user', JSON.stringify(response.data));
                // window.location.href = '/';
            }else{
                console.log('Ошибка ' + response.message);
                setError(response.message);
            }
        } catch (error) {
            console.error('Полная ошибка:', error);
            throw error;
        }
    };

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
                <div className="img-container" data-aos="zoom-in" data-aos-duration="800" data-aos-delay="200" >
                    <img src={moon} alt="moon" />
                </div>
                <div className="form-container">
                    <div className="form-content" data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
                        <p className="brand" data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">Inseptum</p>
                        <h1>Регистрация</h1>
                        {error && <h2 className="error">{error}</h2>}

                        <Form>
                            <Input
                                type="text"
                                title="text"
                                placeholder="Введите ваше имя"
                                name="username"
                                ref={usernameRef}
                                onChange={handleChange}
                            />
                            <Input
                                type="password"
                                title="password"
                                placeholder="Введите пароль"
                                name="password"
                                ref={passwordRef}
                                onChange={handleChange}
                            />
                            <Input
                                type="password"
                                title="password"
                                placeholder="Повторите пароль"
                                name="confirm_password"
                                ref={confirm_passwordRef}
                                onChange={handleChange}
                            />
                            <Input
                                type="submit"
                                title="submit"
                                value="Зарегистрироваться"
                                onClick={handleSubmit}
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