import React, {useState} from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import LoginForm from "./pages/Login";
import BooksPage from "./pages/Books";
import BookDetailsPage from "./pages/BookDetailsPage"; // Import the BookDetailsPage component
import "tailwindcss/tailwind.css";
import SignupForm from "./pages/Signup";
import Header from "./components/layout/Header";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReadingList from "./pages/ReadingList";


const App: React.FC = () => {

  return (
    <BrowserRouter>
       <ToastContainer />
       <Header/>
      <Routes>
      <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/reading-list" element={<ReadingList />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/book/:bookId" element={<BookDetailsPage />} /> {/* Add route for book details */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
