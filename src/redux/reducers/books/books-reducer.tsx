// src/redux/reducers/books/booksSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { isErrorResponse } from "../../../utils/errorHander";
import {
  RegisterErrorResponse,
  LoginResponse,
  RegisterSuccessResponse,
} from "../../services/auth/auth-services";
import {
  fetchBooksFromAPI,
  fetchBookDetailsFromAPI,
  authAPI,
  PayloadBook,
  FetchBookResponse,
} from "../../services/books/books-services";
import { SingleBook } from "../../../components/common/BookCard";

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

interface BooksState {
  items: Book[];
  readingList:FetchBookResponse[],
  bookDetails: BookDetails | null;
  singleBookDetails:SingleBook | {
    id: "",
    volumeInfo: {
      title:"",
      authors:[],
      description:"",
      publisher:"",
      publishedDate:"",
      pageCount:0,
      categories:[],
      averageRating:0,
      ratingsCount:0,
      imageLinks: {
        thumbnail: "",
      },
      previewLink:"",
    },
    book_id:"",
    title:"",
    authors:[],
    description:"",
    publisher:"",
    publishedDate:"",
    pageCount:0,
    categories:[],
    image:"",
    previewLink:"",
  }
  loading: boolean;
  error: string | null;
  cameFrom:string
}

const initialState: BooksState = {
  items: [],
  bookDetails: null,
  loading: false,
  error: null,
  readingList:[],
  singleBookDetails:{
    id: "",
    volumeInfo: {
      title:"",
      authors:[],
      description:"",
      publisher:"",
      publishedDate:"",
      pageCount:0,
      categories:[],
      averageRating:0,
      ratingsCount:0,
      imageLinks: {
        thumbnail: "",
      },
      previewLink:"",
    },
    book_id:"",
    title:"",
    authors:[],
    description:"",
    publisher:"",
    publishedDate:"",
    pageCount:0,
    categories:[],
    image:"",
    previewLink:"",
  },
  cameFrom:""
};

export const fetchBooks = createAsyncThunk<Book[], string>(
  "books/fetchBooks",
  async (query) => {
    const books = await fetchBooksFromAPI(query);
    return books;
  }
);

export const fetchBookDetails = createAsyncThunk<BookDetails, string>(
  "books/fetchBookDetails",
  async (bookId) => {
    const bookDetails = await fetchBookDetailsFromAPI(bookId);
    return bookDetails;
  }
);

export const addBookThunk = createAsyncThunk(
  "/addBook",
  async (payload: PayloadBook, { rejectWithValue }) => {
    const response = await authAPI.addBookToReadingList(payload);
    if (isErrorResponse(response) && response.error.statusCode !== 200) {
      return rejectWithValue(response as RegisterErrorResponse);
    }
    return response as RegisterSuccessResponse;
  }
);


export const removeBookThunk = createAsyncThunk(
  "/removeBook",
  async (payload: {token:string, bookId:string | undefined}, { rejectWithValue }) => {
    const response = await authAPI.removeBookToReadingList(payload);
    if (isErrorResponse(response) && response.error.statusCode !== 200) {
      return rejectWithValue(response as RegisterErrorResponse);
    }
    return response as RegisterSuccessResponse;
  }
);

export const getBookThunk = createAsyncThunk(
  "/getBook",
  async (payload: { token: string }, { rejectWithValue }) => {
    const response = await authAPI.fetchReadingList(payload);
    if (isErrorResponse(response) && response.error.statusCode !== 200) {
      return rejectWithValue(response as RegisterErrorResponse);
    }
    return response as FetchBookResponse[];
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    removeBookState(state) {
      state.items = [];
      state.bookDetails = null;
      state.loading = false;
      state.error = null;
    },
    setBookDetails(state,action){
      state.singleBookDetails = action.payload.data;
      state.cameFrom=action.payload.cameFrom
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch books";
      })
      .addCase(fetchBookDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookDetails.fulfilled, (state, action) => {
        state.bookDetails = action.payload;
        state.loading = false;
      })
      .addCase(fetchBookDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch book details";
      })
      .addCase(getBookThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch book details";
      })
      .addCase(getBookThunk.fulfilled, (state, action) => {
        state.readingList = action.payload;
        state.loading = false;
      });

      
  },
});

export type BooksStateType = typeof initialState;
export const { removeBookState,setBookDetails } = booksSlice.actions;
export default booksSlice.reducer;
