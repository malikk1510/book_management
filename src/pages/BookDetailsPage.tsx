import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import "tailwindcss/tailwind.css";
import {
  addBookThunk,
  fetchBookDetails,
  removeBookThunk,
} from "../redux/reducers/books/books-reducer";

import DummyImg from "../assets/images/unnamed.jpg";
import Spinner from "../components/common/Spinner";
import {
  LoginResponse,
  RegisterErrorResponse,
  RegisterSuccessResponse,
  api,
} from "../redux/services/auth/auth-services";
import { showErrorToast, showSuccessToast } from "../components/common/Toast";
import Loader from "../components/common/Loader";

const dummyImage = DummyImg; // URL for dummy image

const cleanHTML = (html: string) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

const BookDetailsPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate()

  const auth = useSelector((state: RootState) => state.auth);
  const { singleBookDetails: book, loading, cameFrom } = useSelector(
    (state: RootState) => state.books
  );

  const [apiLoading, setApiLoading] = useState<boolean>(false);

  useEffect(() => {
    if (bookId) {
      // dispatch(fetchBookDetails(bookId));
    }
  }, [dispatch, bookId]);

  const addBookToReadingList = async () => {
    setApiLoading(true);
    const payload = {
      bookDetails: {
        book_id: book?.id ,
        title: book?.volumeInfo.title || book.title,
        authors: book?.volumeInfo.authors || book.authors,
        description: book?.volumeInfo.description || book.description,
        publisher: book?.volumeInfo.publisher || book.publisher,
        publishedDate: book?.volumeInfo.publishedDate || book.publishedDate,
        pageCount: book?.volumeInfo.pageCount || book.pageCount,
        categories: book?.volumeInfo.categories || book.categories,
        image: book?.volumeInfo.imageLinks?.thumbnail || book.image,
        previewLink: book?.volumeInfo.previewLink || book.previewLink,
      },
      token: auth.access_token,
    };
    try {
      const resultAction = await dispatch(addBookThunk(payload));
      if (addBookThunk.fulfilled.match(resultAction)) {
        const response = resultAction.payload as RegisterSuccessResponse;
        showSuccessToast(response.msg);
      } else {
        const errorResponse = resultAction.payload as RegisterErrorResponse;
        showErrorToast(errorResponse.message);
      }
    } catch (error) {
    } finally {
      setApiLoading(false);
    }
  };

  const removeBookFromReadingList = async () => {
    setApiLoading(true);
    const payload = {
      token: auth.access_token,
      bookId: book.id,
    };
    try {
      const resultAction = await dispatch(removeBookThunk(payload));
      if (removeBookThunk.fulfilled.match(resultAction)) {
        const response = resultAction.payload;
        showSuccessToast(response.msg);
        navigate("/reading-list")
      } else {
        const errorResponse = resultAction.payload as RegisterErrorResponse;
        showErrorToast(errorResponse.message);
      }
    } catch (error) {
      showErrorToast("An error occurred.");
    } finally {
      setApiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        Book not found
      </div>
    );
  }

  const description = cleanHTML(book.volumeInfo.description || "");

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg ">
        <div className="flex flex-col md:flex-row">
          <img
            className="rounded-lg object-contain w-full md:w-1/3 h-64 md:h-auto mb-4 md:mb-0"
            src={book.volumeInfo.imageLinks?.thumbnail || dummyImage}
            alt={book.volumeInfo.title}
          />
          <div className="md:ml-6">
            <h1 className="text-3xl font-bold mb-2">{book.volumeInfo.title}</h1>
            <p className="text-gray-700 mb-4">
              {book.volumeInfo.authors?.join(", ")}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Publisher:</strong> {book.volumeInfo.publisher}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Published Date:</strong> {book.volumeInfo.publishedDate}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Page Count:</strong> {book.volumeInfo.pageCount}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Categories:</strong>{" "}
              {book.volumeInfo.categories?.join(", ")}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Rating:</strong> {book.volumeInfo.averageRating} (
              {book.volumeInfo.ratingsCount} ratings)
            </p>
            <a
              href={book.volumeInfo.previewLink}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Preview
              <svg
                className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </a>
            <button
              disabled={apiLoading}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-500 rounded-lg hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 ml-2"
              onClick={() => {
                if (cameFrom === "reading-list") {
                  removeBookFromReadingList();
                } else {
                  addBookToReadingList();
                }
              }}
            >
              {apiLoading ? (
                <Loader />
              ) : cameFrom === "reading-list" ? (
                "Remove from reading list"
              ) : (
                "Add to reading list"
              )}
            </button>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-2">Description</h2>
          <p className="text-gray-700">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;
