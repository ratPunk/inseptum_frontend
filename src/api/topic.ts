import axios from "axios";

const url = "http://localhost/inseptum_backend/";

async function getTopic(id: string = ''): Promise<any> {
    try {
        const response = await axios({
            method: 'get', 
            url: `${url}topics/${id}`,
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            validateStatus: (status) => status < 500 // Принимаем все статусы кроме 5xx
        });

        console.log('Статус темы:', response.status);
        console.log('Данные темы:', response.data);

        return response.data;
    } catch (error) {
        console.error('Ошибка при запросе:', error);
        throw error;
    }
}

export default getTopic; 