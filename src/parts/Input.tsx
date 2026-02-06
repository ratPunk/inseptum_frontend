import "@/style/css/parts_css/input.css";

interface InputProps {
    type: string;
    title: string;
    placeholder?: string;
    name?: string;
    className?: string; 
    ref?: any;
    value?: string;
}

function Input({type='text', title='input', placeholder='enter', name, className, ref, value}: InputProps) {
    return (
        <>
        <input type={type} title={title} placeholder={placeholder} name={name} className={`input ${className}`} ref={ref} value={value}/>
        </>
    );
}

export default Input;