import Link from "@/parts/link";
import "@/style/css/components_css/moduleCard.css";
import { IoIosArrowRoundForward } from "react-icons/io";
import { FaBootstrap } from "react-icons/fa6";
import { IconType } from "react-icons";

interface ModuleCardProps{
    title: string;
    icon?: IconType | undefined;
    onClick: (moduleId: string) => void;
    className?: string;
    key: string;
    moduleId: string;
}

function ModuleCard({title, icon: Icon, onClick, className, key, moduleId}: ModuleCardProps){
    return(
        <div className="module-card" onClick={() => onClick(moduleId)} key={key}>
            <div className={`module-card-content ${className}`}>
                {Icon && <Icon />}
                <p>{title}</p>
            </div>
        </div>
    )
}

export default ModuleCard;