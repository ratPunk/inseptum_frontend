import "@/style/css/modules_css/form.css";

interface FormProps{
    children: React.ReactNode;
    action?: string;
    method?: string;
    className?: string;
}

function Form({children, action, method = 'post', className}: FormProps){
    return(
        <form action={action} method={method} className={`form ${className}`}>
            {children}
        </form>
    )
}

export default Form;