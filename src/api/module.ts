import axios from "axios";
import loginData from "@/types/loginData";
import {SuccessResponse, ErrorResponse} from "@/types/response";

const url = "http://localhost/inseptum_backend/";

async function getModule(id: string = ''): Promise<any> {
    try {
        const response = await axios({
            method: 'get', 
            url: `${url}module/${id}`,
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            validateStatus: (status) => status < 500 // Принимаем все статусы кроме 5xx
        });

        console.log('Статус:', response.status);
        console.log('Данные:', response.data);

        return response.data;
    } catch (error) {
        console.error('Ошибка при запросе:', error);
        throw error;
    }
}

export default getModule; 