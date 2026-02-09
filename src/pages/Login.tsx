import Input from "@/parts/Input";
import { useRef, useState } from "react";
import "@/style/css/page_css/login.css";
import Form from "@/modules/Form";
import sum from "@/style/images/sun.png";

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import loginData from "@/types/loginData";
import { SuccessResponse, ErrorResponse } from "@/types/response";
import loginUser from "@/api/login";
import useDisableScroll from "@/hooks/useDisableScroll";

function Login() {
    useDisableScroll(true); 

    const [error, setError] = useState('');
    const [form, setForm] = useState<loginData>(
        {
            username: '',
            password: '',
        }
    );

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };


    const handleSubmit = async (e: React.MouseEvent<HTMLInputElement>) => {
        e.preventDefault();
        try {
            const response: SuccessResponse | ErrorResponse = await loginUser(form);

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
        <div id="Login">
            <div className="login-container">
                <div className="img-container" data-aos="zoom-in" data-aos-duration="800" data-aos-delay="200">
                    <img src={sum} alt="sun" />
                </div>
                <div className="form-container">
                    <div className="form-content" data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
                        <p className="brand" data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">Inseptum</p>
                        <h1>Вход</h1>
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
                                type="submit" 
                                title="submit" 
                                value="Войти"
                                onClick={handleSubmit}
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