import axios from 'axios';
import { AuthorDTO, ProductAuthorDTO } from '../types/author';

const API_URL = 'http://localhost:8080/author';

export const authorService = {
    getAllAuthors: async (page: number = 1) => {
        const response = await axios.get(`${API_URL}/list?page=${page}`);
        return response.data;
    },

    getAuthorDetail: async (id: number) => {
        const response = await axios.get(`${API_URL}/detail?id=${id}`);
        return response.data;
    }
}; 