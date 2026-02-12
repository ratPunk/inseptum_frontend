import Link from "@/parts/link";
import "@/style/css/components_css/topicCard.css";

import IDEHTML from "@/style/svg/IDEHTML.svg";
import { IconType } from "react-icons";
import { IoIosArrowRoundForward } from "react-icons/io";

interface TopicCardProps {
    title: string;
    description: string;
    tag?: string;
    href: string;
    className?: string;
    icon?: IconType | undefined;
}

function TopicCard({title, description, tag, href = '/', className, icon: Icon}: TopicCardProps) {
    return (
        <div className={`topic-card ${className}`}> 
            <div className="topic-card-image">
                <img src={IDEHTML} alt="" />
            </div>
            <div className="topic-card-content">
                <p className="topic-card-tag">{tag}</p>
                <div className="icon">{Icon && <Icon/>}</div>
                <h1 className="topic-card-title">{title}</h1>
                <p className="topic-card-description">{description}</p>
                <Link href={href} text="Вперёд!" className="reverse" icon={IoIosArrowRoundForward}/>
            </div>
        </div>
    )
}        

export default TopicCard;