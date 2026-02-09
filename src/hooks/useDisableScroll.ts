// hooks/useDisableScroll.js
import { useEffect } from 'react';

function useDisableScroll(disabled = true) {
    useEffect(() => {
        if (disabled) {
            // Запоминаем текущую позицию скролла
            const scrollY = window.scrollY;
            
            // Отключаем скролл
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            
            return () => {
                // Восстанавливаем
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                
                // Возвращаем скролл на прежнее место
                window.scrollTo(0, scrollY);
            };
        }
    }, [disabled]);
}

export default useDisableScroll;


   // useDisableScroll(true); // Отключаем скролл
    
