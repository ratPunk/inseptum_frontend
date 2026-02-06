import "@/style/css/parts_css/link.css";
import { IconType } from "react-icons";

interface LinkProps {
    href: string;
    text?: string;
    className?: string;
    icon?: IconType | undefined;
    image?: string;
}

function Link({ href, text, className, icon: Icon, image }: LinkProps) {
    return (
        <>
            <a href={href} className={`link ${className}`}>
                {Icon && <Icon />}
                {image ? (<img src={image} alt="" />) : null}
                {text}
            </a>
        </>
    )
}

export default Link;