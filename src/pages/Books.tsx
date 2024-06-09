// src/pages/Books.js or .tsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../redux/reducers/books/books-reducer";
import { AppDispatch, RootState } from "../redux/store";
import "tailwindcss/tailwind.css";
import Spinner from "../components/common/Spinner";
import BookCard from "../components/common/BookCard";


const BooksPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const dispatch: AppDispatch = useDispatch();
  const {
    items: books,
    loading,

  } = useSelector((state: RootState) => state.books);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(fetchBooks(query));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Search for Books</h1>
      <form onSubmit={handleSearch} className="max-w-md mx-auto mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
          placeholder="Search by title, author, or genre"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
        >
          Search
        </button>
      </form>
      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard book={book} isVolumeInfo={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksPage;
