// src/services/booksService.ts
import axios from 'axios';
import { handleApiError } from "../../../utils/errorHander";
import {baseURL,api, RegisterErrorResponse, LoginResponse, RegisterSuccessResponse} from  "../auth/auth-services"

const apiKey = 'AIzaSyBEWASAHwcpvMbCmXGTuIGHK5VCCXGRhEU';

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      thumbnail: string;
    };
  };
}
interface BookDetails {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    publisher?: string;
    publishedDate?: string;
    pageCount?: number;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    imageLinks?: {
      thumbnail: string;
      smallThumbnail: string;
    };
    previewLink?: string;
  };
}

export interface FetchBookResponse {
  book_id?: string;
  title?: string;
  authors?: string[];
  description?: string;
  publisher?: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  image?: string;
  previewLink?: string;
}

export interface PayloadBook {
  bookDetails: FetchBookResponse;
  token: string;
}
export const fetchBooksFromAPI = async (query: string): Promise<Book[]> => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`
    );
    return response.data.items || [];
  } catch (error) {
    throw new Error('Error fetching books from API');
  }
};

const API_KEY = "AIzaSyBEWASAHwcpvMbCmXGTuIGHK5VCCXGRhEU";

export const fetchBookDetailsFromAPI = async (bookId: string): Promise<BookDetails> => {
  const response = await axios.get(
    `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API_KEY}`
  );
  return response.data || [];
};


export const authAPI = {
  addBookToReadingList: async (
    payload: PayloadBook
  ): Promise<RegisterSuccessResponse | RegisterErrorResponse> => {
    try {
      const response = await api.post(
        `${baseURL}add/book`,
        {  ...payload.bookDetails },
        {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            "x-auth-token": payload.token,
          },
        }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  removeBookToReadingList: async (
    payload: {token:string, bookId:string | undefined}
  ): Promise<RegisterSuccessResponse | RegisterErrorResponse> => {
    try {
      const response = await api.delete(
        `${baseURL}remove/book/${payload.bookId}`,
       
        {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            "x-auth-token": payload.token,
          },
        }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  fetchReadingList: async (payload: {
    token: string;
  }): Promise<FetchBookResponse[] | RegisterErrorResponse> => {
    try {
      const response = await api.get(
        `${baseURL}books`,
        {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            "x-auth-token": payload.token,
          },
        }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};
