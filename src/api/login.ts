import axios from "axios";
import loginData from "@/types/loginData";
import {SuccessResponse,  ErrorResponse} from "@/types/response";

const url = "http://localhost/inseptum_backend/";

async function loginUser({username, password}: loginData) {
    try {
        const response: any = await axios({
            method: 'post',
            url: 'http://localhost/inseptum_backend/login',
            data: {
                username: username,
                password: password,
            },
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            validateStatus: () => true
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

export default loginUser;