import axios from "axios";
import registerData from "@/types/registerData";
import {SuccessResponse,  ErrorResponse} from "@/types/response";

const url = "http://localhost/inseptum_backend/";

async function registerUser({ username, password, confirm_password }: registerData) {
    try {
        const response: any = await axios({
            method: 'post',
            url: 'http://localhost/inseptum_backend/register',
            data: {
                username: username,
                password: password,
                confirm_password: confirm_password
            },
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            validateStatus: () => true
            //   timeout: 5000 // 5 секунд таймаут
            
        })

        const result = response.data;

        console.log('Статус:', response.status);
        console.log('Данные:', response.data);

        return result;
    } catch (error) {
        console.error('Полная ошибка:', error);
        throw error;
    }
}

export default registerUser;