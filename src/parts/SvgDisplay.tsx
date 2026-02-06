import "@/style/css/parts_css/svgDisplay.css";

interface SvgDisplayProps {
    svg: string
}

function SvgDisplay({ svg }: SvgDisplayProps) {
    return (
        <img className="svg-display" src={svg} alt="" />
    )
}

export default SvgDisplay;