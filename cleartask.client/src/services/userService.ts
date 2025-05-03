import {  getHeaders } from "../utils/authUtils";
import { API_user_getUserInfo } from "../config/apiEndpoints";
import userdto from "../types/user";
import axios from "axios";


export const getUserDetails =  async (id: string) : Promise<{ userdto: userdto }> => {
    const Headers = getHeaders();
    const response = await axios.get<{ userdto: userdto }>(API_user_getUserInfo, {
        headers: Headers, 
        params: { id } 
    });
    return response.data;
}

