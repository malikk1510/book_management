import React, { useEffect } from "react";

import { AppDispatch, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import "tailwindcss/tailwind.css";

import {

  getBookThunk,
} from "../redux/reducers/books/books-reducer";

import Spinner from "../components/common/Spinner";

import BookCard from "../components/common/BookCard";

const ReadingList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const {
    readingList: books,
    loading,
  } = useSelector((state: RootState) => state.books);
  useEffect(() => {
    dispatch(getBookThunk({ token: auth.access_token }));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (!books) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        Book not found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {books?.map((book: any) => (
        <BookCard book={book.book} isVolumeInfo={false} />
      ))}
    </div>
  );
};

export default ReadingList;
