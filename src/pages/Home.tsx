import "@/style/css/page_css/home.css";
// import "@/style/css/animation.css";
import Link from "@/parts/link";
import javascript from "@/style/images/javascript.png";
import streams from "@/style/images/streams.png";
import keyboard from "@/style/images/keyboard.png";
import door from "@/style/images/door.png";
import bookcase from "@/style/images/bookcase.png";
import { IoIosArrowRoundForward } from "react-icons/io";
import mount from "@/style/images/mountain.jpeg";
import { FaBook } from "react-icons/fa";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { FaGear } from "react-icons/fa6";
import whales from "@/style/images/whales.png";
import { IoIosArrowDown } from "react-icons/io";
import { FaCode } from "react-icons/fa";
import { FaCodeCompare } from "react-icons/fa6";

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Home() {

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
        <div className="home" id="Home">
            <div className="home-container">
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-block hero-block-1">
                        <p
                            className="inseptum"
                            data-aos="fade-left"
                            data-aos-duration="1800"
                        >
                            Inseptum
                        </p>
                        <h1
                            className="title"
                            data-aos="fade-right"
                            data-aos-duration="1100"
                            data-aos-delay="200"
                        >
                            Готовься к экзамену с нами
                        </h1>
                        <p
                            className="description"
                            data-aos="fade-up"
                            data-aos-duration="1000"
                            data-aos-delay="400"
                        >
                            Бесплатные материалы, которые реально работают. Статьи, тесты и практические задания для эффективной подготовки.
                        </p>
                        {/* <div className="cta-button-group">
                            <Link href="/" text="Начать подготовку" className="cta-link-hero"/>
                            <Link href="/" text="Посмотреть задания" className="cta-link-hero"/>
                        </div> */}
                    </div>
                    <div
                        className="hero-block hero-block-2"
                        data-aos="fade-up"
                        data-aos-duration="1200"
                        data-aos-delay="600"
                    >
                        <div className="block-container">
                            <div className="block block-1"><FaBook size={32} />Изучай</div>
                            <div className="block block-2"><FaCodeCompare size={32} />Проверяй</div>
                            <div className="block block-3"><FaCode size={32} />Практикуй</div>
                        </div>
                        <p>Сначала ты изучаешь теорию по теме, затем проверяешь понимание через тесты, и наконец — оттачиваешь навыки на реальных практических заданиях. <big>Эта система гарантирует, что ты не просто «прошел тему», а действительно готов к экзамену.</big></p>
                        
                    </div>
                    <div
                        className="hero-block hero-block-3"
                        data-aos="zoom-in"
                        data-aos-duration="1200"
                        data-aos-delay="800"
                    >
                        <img src={mount} alt="Горы" loading="lazy" />
                    </div>
                </section>

                {/* Advantages Section */}
                <section className="advantages">
                    <h1
                        data-aos="fade-up"
                        data-aos-duration="1000"
                        data-aos-delay="200"
                    >
                        Почему Inseptum?
                    </h1>
                    <div className="advantages-list">
                        <div
                            className="advantages-block"
                            data-aos="fade-right"
                            data-aos-duration="900"
                            data-aos-delay="300"
                        >
                            <img
                                src={streams}
                                alt="Актуальные материалы"
                                loading="lazy"
                                data-aos="zoom-in"
                                data-aos-duration="800"
                                data-aos-delay="500"
                            />
                            <div className="advantages-block-text">
                                <h2>Актуальные материалы</h2>
                                <p>Все задания соответствуют текущим требованиям демо-экзамена. Мы следим за обновлениями.</p>
                            </div>
                        </div>
                        <div
                            className="advantages-block"
                            data-aos="fade-right"
                            data-aos-duration="900"
                            data-aos-delay="400"
                        >
                            <img
                                src={keyboard}
                                alt="Практика, а не теория"
                                loading="lazy"
                                data-aos="zoom-in"
                                data-aos-duration="800"
                                data-aos-delay="600"
                            />
                            <div className="advantages-block-text">
                                <h2>Практика, а не теория</h2>
                                <p>Минимум воды. Максимум реальных заданий, тестов и симуляций экзамена.</p>
                            </div>
                        </div>
                        <div
                            className="advantages-block"
                            data-aos="fade-right"
                            data-aos-duration="900"
                            data-aos-delay="500"
                        >
                            <img
                                src={door}
                                alt="Это бесплатно"
                                loading="lazy"
                                data-aos="zoom-in"
                                data-aos-duration="800"
                                data-aos-delay="700"
                            />
                            <div className="advantages-block-text">
                                <h2>Это бесплатно</h2>
                                <p>Мы верим, что качественная подготовка должна быть доступна каждому студенту. И всегда будет такой.</p>
                            </div>
                        </div>
                        <div
                            className="advantages-block"
                            data-aos="fade-right"
                            data-aos-duration="900"
                            data-aos-delay="600"
                        >
                            <img
                                src={bookcase}
                                alt="Структура — это сила"
                                loading="lazy"
                                data-aos="zoom-in"
                                data-aos-duration="800"
                                data-aos-delay="800"
                            />
                            <div className="advantages-block-text">
                                <h2>Структура — это сила</h2>
                                <p>Материалы разбиты по темам и компетенциям, чтобы ты мог подтягивать именно свои слабые места.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Key Sections */}
                <section className="key-sections">
                    <h1
                        data-aos="fade-up"
                        data-aos-duration="1000"
                        data-aos-delay="200"
                    >
                        Что ты найдешь на сайте
                    </h1>
                    <div className="key-sections-container">
                        <div
                            className="left"
                            data-aos="fade-right"
                            data-aos-duration="1100"
                            data-aos-delay="300"
                        >
                            <h2>Три кита твоей подготовки</h2>
                            <div
                                className="image-container"
                                data-aos="zoom-in"
                                data-aos-duration="1200"
                                data-aos-delay="500"
                            >
                                <img src={whales} alt="Три кита подготовки" loading="lazy" />
                            </div>
                        </div>
                        <div className="right">
                            <div
                                className="block block-1"
                                data-aos="fade-left"
                                data-aos-duration="1000"
                                data-aos-delay="400"
                            >
                                <span>
                                    <FaBook color="#fff" size={42} />
                                    <h2>Статьи и теория</h2>
                                </span>
                                <p>Ключевые понятия, разбор критериев, алгоритмы выполнения — вся необходимая теория в структурированном виде.</p>
                                <Link href="/" text="Изучить статьи" className="reverse" icon={IoIosArrowRoundForward} />
                            </div>
                            <div
                                className="block block-2"
                                data-aos="fade-left"
                                data-aos-duration="1000"
                                data-aos-delay="500"
                            >
                                <span>
                                    <IoIosCheckmarkCircle color="#fff" size={42} />
                                    <h2>Тесты и проверка</h2>
                                </span>
                                <p>Интерактивные тесты для самопроверки после каждой темы. Узнай, что ты усвоил, а что стоит повторить.</p>
                                <Link href="/" text="Пройти тест" className="reverse" icon={IoIosArrowRoundForward} />
                            </div>
                            <div
                                className="block block-3"
                                data-aos="fade-left"
                                data-aos-duration="1000"
                                data-aos-delay="600"
                            >
                                <span>
                                    <FaGear color="#fff" size={42} />
                                    <h2>Практические задания</h2>
                                </span>
                                <p>Настоящие практические задачи, максимально приближенные к экзаменационным. Решай, проверяй, анализируй ошибки.</p>
                                <Link href="/" text="Решать задачи" className="reverse" icon={IoIosArrowRoundForward} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call for Registration */}
                <section className="call-for-registration">
                    <h1
                        data-aos="fade-up"
                        data-aos-duration="1200"
                        data-aos-delay="200"
                    >
                        Присоединяйся
                    </h1>
                    <div
                        className="call-for-registration-container"
                        data-aos="zoom-in"
                        data-aos-duration="1000"
                        data-aos-delay="400"
                    >
                        <h1>Получи доступ ко всем материалам. Просто и бесплатно.</h1>
                        <p>Зарегистрируйся, чтобы сохранять свой прогресс, отслеживать результаты и получать персонализированные рекомендации. Никаких скрытых платежей.</p>
                        <Link href="/" text="Начать бесплатно" className="cta-link" />
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="FAQ">
                    <h1
                        data-aos="fade-up"
                        data-aos-duration="1000"
                        data-aos-delay="200"
                    >
                        Ответы на частые вопросы
                    </h1>
                    <div className="FAQ-container">
                        <div
                            className="faq-item"
                            data-aos="fade-up"
                            data-aos-duration="800"
                            data-aos-delay="300"
                        >
                            <div className="faq-question">
                                <h2>Насколько ваши материалы соответствуют реальному демо-экзамену?</h2>
                                <span className="faq-icon"><IoIosArrowDown /></span>
                            </div>
                            <div className="faq-answer">
                                <p>Мы постоянно анализируем демоверсии и опыт студентов, чтобы наши задания были максимально актуальными.</p>
                            </div>
                        </div>

                        <div
                            className="faq-item"
                            data-aos="fade-up"
                            data-aos-duration="800"
                            data-aos-delay="400"
                        >
                            <div className="faq-question">
                                <h2>Это действительно полностью бесплатно?</h2>
                                <span className="faq-icon"><IoIosArrowDown /></span>
                            </div>
                            <div className="faq-answer">
                                <p>Да. Весь контент на сайте доступен без ограничений и платных подписок. Наша цель — помочь, а не заработать.</p>
                            </div>
                        </div>

                        <div
                            className="faq-item"
                            data-aos="fade-up"
                            data-aos-duration="800"
                            data-aos-delay="500"
                        >
                            <div className="faq-question">
                                <h2>С чего лучше начать подготовку?</h2>
                                <span className="faq-icon"><IoIosArrowDown /></span>
                            </div>
                            <div className="faq-answer">
                                <p>Рекомендуем идти по порядку: изучи теорию по теме, пройди тест, а затем закрепи результат практическим заданием.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                {/* <section className="cta-section">
                    <h1 
                        data-aos="fade-up" 
                        data-aos-duration="1200"
                        data-aos-delay="200"
                    >
                        Не откладывай подготовку на потом.
                    </h1>
                    <div 
                        className="cta-section-container"
                        data-aos="fade-up"
                        data-aos-duration="1100"
                        data-aos-delay="400"
                    >
                        <h2>Начни готовиться к успешной сдаче демо-экзамена с нами!</h2>
                        <p>Начни свой путь к успешной сдаче демо-экзамена прямо сейчас.</p>
                        <Link href="/" text="Начать учиться бесплатно" className="big-link cta-link" />
                    </div>
                </section> */}
            </div>
        </div>
    )
}

export default Home;