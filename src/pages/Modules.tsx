import getModule from "@/api/module";
import ModuleCard from "@/components/ModuleCard";
import Link from "@/parts/link";
import "@/style/css/page_css/modules.css";
import bootstrap from "@/style/svg/bootstrap.svg";
import { useEffect, useState } from "react";

import iconModuleMap from "@/data/moduleIconData";
import imageModuleMap from "@/data/moduleImageData";

import moduleType from "@/types/moduleType";

import AOS from 'aos';
import 'aos/dist/aos.css';

function Modules() {
    const [modules, setModules] = useState<moduleType[]>([]);
    // const [selectedModule, setSelectedModule] = useState<moduleType>();
    const [moduleId, setModuleId] = useState('1');

    const handleModuleClick = (moduleId: string) => {
        setModuleId(moduleId);
        // console.log(moduleId);
    };

    useEffect(() => {
        const fetchAllDataModules = async () => {
            try {
                const response = await getModule();
                console.log(response.data);
                setModules(response.data);
            } catch (error) {
                console.error('Ошибка загрузки:', error);
            }
        };

        fetchAllDataModules();
    }, []);

    // useEffect(() => {
    //     const fetchOneDataModules = async () => {
    //         try {
    //             const response = await getModule(moduleId);
    //             console.log('Один модуль' + response.data);
    //             setSelectedModule(response.data);
    //         } catch (error) {
    //             console.error('Ошибка загрузки:', error);
    //         }
    //     };

    //     if (moduleId === '') return
    //     else fetchOneDataModules();

    // }, [moduleId]);

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            delay: 100,
            mirror: false,
        });
    }, []);

    const selectedModule = modules.find(module => module.id === moduleId);

    if (!modules || modules.length === 0) return <div>Загрузка...</div>;
    if (!selectedModule) return <div>Загрузка...</div>;

    return (
        <div id="Modules">
            <div className="modules-container">
                {/* Заголовок страницы */}
                <h1 data-aos="fade-down"
                    data-aos-duration="600"
                    data-aos-delay="100">
                    Модули
                </h1>

                {/* Основной блок с выбранным модулем */}
                <div className="modules-block"
                    data-aos="fade-up"
                    data-aos-duration="800"
                    data-aos-delay="200">

                    <div className="modules-info">
                        {/* Заголовок модуля */}
                        <h1 className="modules-title"
                            data-aos="fade-right"
                            data-aos-duration="700"
                            data-aos-delay="300">
                            {selectedModule.title}
                        </h1>

                        {/* Описание модуля */}
                        <h3 className="modules-description"
                            data-aos="fade-right"
                            data-aos-duration="700"
                            data-aos-delay="400">
                            {selectedModule.description}
                        </h3>

                        {/* Блок ссылок */}
                        <div className="link-block"
                            data-aos="fade-right"
                            data-aos-duration="600"
                            data-aos-delay="500">
                            <Link href={`/topic/ ${Number(moduleId)}`}
                                text="Темы"
                                className="cta-link"
                            />
                            <Link href="/"
                                text="Статьи"
                                className="cta-link"
                            />
                            <Link href="/"
                                text="Тесты"
                                className="cta-link"
                            />
                            <Link href="/"
                                text="Задачи"
                                className="cta-link"
                            />
                        </div>
                    </div>

                    {/* Изображение модуля */}
                    <div className="modules-image"
                        data-aos="fade-left"
                        data-aos-duration="800"
                        data-aos-delay="400"
                        key={selectedModule.id}>
                        <img src={imageModuleMap[selectedModule.title.toLowerCase() as keyof typeof imageModuleMap]} alt="" />
                    </div>
                </div>

                {/* Список модулей */}
                <div className="modules-list"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="500"
                >
                    {modules.map((module: any) => (
                        <ModuleCard
                            title={module.title}
                            icon={iconModuleMap[module.title.toLowerCase() as keyof typeof iconModuleMap]}
                            className={`${module.title.toLowerCase()} ${moduleId === module.id ? `active-${module.title.toLowerCase()}` : ''}`}
                            onClick={handleModuleClick}
                            key={module.id}
                            moduleId={module.id}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Modules;