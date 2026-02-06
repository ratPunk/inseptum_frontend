import Link from "@/parts/link";
import "@/style/css/modules_css/footer.css";
import telegramIconSvg from "@/style/svg/telegramIcon.svg";
import youtubeIconSvg from "@/style/svg/youtubeIcon.svg";
import vkIconSvg from "@/style/svg/vkIcon.svg";

function Footer(){
    return(
        <footer id="Footer">
            <div className="footer-container">
                <div className="footer-header">
                    <h1>Inseptum</h1>
                    <div className="socials">
                        <Link href="/" image={telegramIconSvg} className="footer-icon-link"/>
                        <Link href="/" image={youtubeIconSvg} className="footer-icon-link"/>
                        <Link href="/" image={vkIconSvg} className="footer-icon-link"/>
                    </div>
                </div>
                <div className="footer-content">
                    <div className="block">
                        <h1 className="title">Навигация</h1>
                        <ul>
                            <li><Link href="/" text="О нас" className="footer-link"/></li>
                            <li><Link href="/" text="Как пользоваться сайтом" className="footer-link"/></li>
                            <li><Link href="/" text="Отзывы" className="footer-link"/></li>
                        </ul>
                    </div>
                    <div className="block">
                        <h1 className="title">Материалы</h1>
                        <ul>
                            <li><Link href="/" text="Статьи и теория" className="footer-link"/></li>
                            <li><Link href="/" text="Тесты и проверка" className="footer-link"/></li>
                            <li><Link href="/" text="Практические задания" className="footer-link"/></li>
                            <li><Link href="/" text="Прогресс подготовки" className="footer-link"/></li>
                        </ul>
                    </div>
                    <div className="block">
                        <h1 className="title">Поддержка</h1>
                        <ul>
                            <li><Link href="/" text="Частые вопросы (FAQ)" className="footer-link"/></li>
                            <li><Link href="/" text="Контакты" className="footer-link"/></li>
                            <li><Link href="/" text="Сообщить об ошибке" className="footer-link"/></li>
                            <li><Link href="/" text="Предложить материал" className="footer-link"/></li>
                        </ul>
                    </div>
                    <div className="block">
                        <h1 className="title">Информация</h1>
                        <ul>
                            <li><Link href="/" text="Пользовательское соглашение" className="footer-link"/></li>
                            <li><Link href="/" text="Политика конфиденциальности" className="footer-link"/></li>
                            <li><Link href="/" text="Условия использования" className="footer-link"/></li>
                            <li><Link href="/" text="Год запуска — 2025 Inseptum" className="footer-link"/></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-copyright">
                    <p>© 2025 Inseptum. Все материалы бесплатны для использования в образовательных целях.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;