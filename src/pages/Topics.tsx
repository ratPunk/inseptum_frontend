import getModule from "@/api/module";
import getTopic from "@/api/topic";
import TopicCard from "@/components/TopicCard";
import iconModuleMap from "@/data/moduleIconData";
import "@/style/css/page_css/topics.css"
import moduleType from "@/types/moduleType";
import topicType from "@/types/topicType";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Topics () {
    const { moduleId } = useParams<{ moduleId: string }>();
    const [selectedModule, setSelectedModule] = useState<moduleType>();
    const [topics, setTopics] = useState<topicType[]>([]);

    useEffect(() => {
        const fetchOneDataModules = async () => {
            try {
                const response = await getModule(moduleId);
                console.log('Один модуль' + response.data);
                setSelectedModule(response.data);
            } catch (error) {
                console.error('Ошибка загрузки:', error);
            }
        };

        if (moduleId === undefined) return
        else fetchOneDataModules();

    }, [moduleId]);

    useEffect(() => {
        const fetchTopicsOneModule = async () => {
            try {
                const response = await getTopic(moduleId);
                console.log('Темы по модулю: ' + response.data);
                setTopics(response.data);
            } catch (error) {
                console.error('Ошибка загрузки:', error);
            }
        };

        const fetchAllTopics = async () => {
            try {
                const response = await getTopic();
                console.log('все темы: ' + response.data);
                setTopics(response.data);
            } catch (error) {
                console.error('Ошибка загрузки:', error);
            }
        };

        if (moduleId === undefined){
            fetchAllTopics();
        }else{ 
            fetchTopicsOneModule();
        }

    }, [moduleId]);

    useEffect(() => {
        console.log('test ' + moduleId);
    }, [moduleId]);


    if(!topics) return <div>Загрузка...</div>;

    return(
        <div id={"Topics"}>
            <div className="topic-container">
                {selectedModule ? (<h1 ><span className={`topic-title topic-title-${selectedModule.title.toLowerCase()}`}>{selectedModule.title}</span> Темы</h1>) : (<h1 >Все темы</h1>)}
                <div className="topic-cards-list">
                    {topics.map((topic: topicType) => (
                        <TopicCard title={topic.title} description={topic.description} 
                        tag={topic.module_title} 
                        icon={iconModuleMap[topic.module_title.toLowerCase() as keyof typeof iconModuleMap]} href="/html" className={`topic-card-${topic.module_title.toLowerCase()}`}/>    
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Topics;