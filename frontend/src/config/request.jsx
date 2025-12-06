import axios from 'axios';
import { apiClient } from './axiosClient';

const request = axios.create({baseURL: import.meta.env.VITE_API_URL, withCredentials: true,});

const apiUser = '/api/user';
const apiProduct = '/api/product'

export const requestRegister = async (data) => {
    const res = await request.post(`${apiUser}/register`, data);
    return res;
};

export const requestLogin = async (data) => {
    const res = await request.post(`${apiUser}/login`, data);
    return res;
};


export const requestUploadImage = async (data) => {
    const res = await apiClient.post(`${apiUser}/upload-image`, data);
    return res.data;
}

export const requestAuth = async () => {
    const res = await apiClient.get(`${apiUser}/auth`);
    return res.data;
};

export const requestLogout = async () => {
    const res = await apiClient.get(`${apiUser}/logout`);
    return res.data;
};

export const requestRefreshToken = async () => {
    const res = await request.get(`${apiUser}/refresh-token`);
    return res.data;
};

export const requestUpdateUser = async (data) => {
    const res = await apiClient.post(`${apiUser}/update-user`, data);
    return res.data;
};

export const requestGetAllUser = async () => {
    const res = await apiClient.get(`${apiUser}/all`);
    return res.data;
};

export const requestUpdateUserAdmin = async (data) => {
    const res = await apiClient.post(`${apiUser}/update-user-admin`, data);
    return res.data;
};

export const cancelRequestIdStudent = async (data) => {
    const res = await apiClient.post(`${apiUser}/cancel-request-id`, data);
    return res.data;
};



export const requestIdStudent = async () => {
    const res = await apiClient.post(`${apiUser}/request-id-student`);
    return res.data;
};

export const requestGetAllUsers = async () => {
    const res = await apiClient.get(`${apiUser}/get-users`);
    return res.data;
};

export const requestDeleteUser = async (data) => {
    const res = await apiClient.post(`${apiUser}/delete-user`, data);
    return res.data;
};

export const requestGetRequestLoan = async () => {
    const res = await apiClient.get(`${apiUser}/get-request-list`);
    return res.data;
};

export const requestConfirmIdStudent = async (data) => {
    const res = await apiClient.post(`${apiUser}/confirm-id-student`, data);
    return res.data;
};

export const requestStatistics = async () => {
    const res = await apiClient.get(`${apiUser}/get-statistics`);
    return res.data;
};


/// product
export const requestGetAllProduct = async () => {
    const res = await request.get(`${apiProduct}/get-all`);
    return res.data;
};

export const requestGetOneProduct = async (id) => {
    const res = await request.get(`${apiProduct}/get-one?id=${id}`);
    return res.data;
};

export const requestSearchProduct = async (keyword) => {
    const res = await request.get(`${apiProduct}/search?keyword=${keyword}`);
    return res.data;
};

export const requestUploadImageProduct = async (data) => {
    const res = await apiClient.post(`${apiProduct}/upload-image`, data);
    return res.data;
};

export const requestCreateProduct = async (data) => {
    const res = await apiClient.post(`${apiProduct}/create`, data);
    return res.data;
};

export const requestUpdateProduct = async (id, data) =>  {
    const res = await apiClient.post(`${apiProduct}/update?id=${id}`, data);
    return res.data;
};

export const requestDeleteProduct = async (id) => {
    const res = await apiClient.post(`${apiProduct}/delete`, { id });
    return res.data;
};

const apiHistory = '/api/history-book'
/// history book
export const requestCreateHistoryBook = async (data) => {
    const res = await apiClient.post(`${apiHistory}/create`, data);
    return res.data;
};

export const requestGetHistoryUser = async () => {
    const res = await apiClient.get(`${apiHistory}/get-history-user`);
    return res.data;
};

export const requestCancelBook = async (data) => {
    const res = await apiClient.post(`${apiHistory}/cancel-book`, data);
    return res.data;
};

export const requestGetAllHistoryBook = async () => {
    const res = await apiClient.get(`${apiHistory}/get-all-history-book`);
    return res.data;
};

export const requestUpdateStatusBook = async (data) => {
    const res = await apiClient.post(`${apiHistory}/update-status-book`, data);
    return res.data;
};


/// UPDATE
export const requestGetFine = async (idHistory) => {
    const res = await apiClient.post(`${apiUser}/get-fine`, {idHistory});
    return res.data;
};

export const requestReturnBook = async ({bookId, idHistory}) => {
    const res = await apiClient.put(`${apiUser}/return-book`, {bookId, idHistory} );
    return res.data;
};

export const requestSendReminder = async (data) => {
    const res = await apiClient.post(`${apiUser}/send-reminder`, data);
    return res.data;
};

export const requestGetReminder = async (data) => {
    const res = await apiClient.get(`${apiUser}/get-reminder`, data)
    return res.data;
}
