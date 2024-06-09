import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { AppDispatch} from "../../redux/store";
import DummyImg from "../../assets/images/unnamed.jpg"
import { setBookDetails } from '../../redux/reducers/books/books-reducer';

export interface SingleBook {
  description?: any;
  publisher?: any;
  publishedDate?: any;
  pageCount?: any;
  categories?: any;
  averageRating?: any;
  ratingsCount?: any;
  previewLink?: any;
  id?: string;
  volumeInfo: {
    title?: string;
    authors?: string[];
    description?: string;
    publisher?: string;
    publishedDate?: string;
    pageCount?: number;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    previewLink?: string;
  };
  book_id?: string; 
  _id?: string;// For the other book structure
  title?: string; // For the other book structure
  authors?: string[]; // For the other book structure
  image?: string; // For the other book structure
}

interface BookCardProps {
  book: SingleBook;
  isVolumeInfo: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ book, isVolumeInfo }) => {
    console.log('book: ', book);
 
    const dispatch: AppDispatch = useDispatch();
    const bookId = isVolumeInfo ? book.id: book._id;
    const title = isVolumeInfo ? book.volumeInfo.title : book.title;
    const image = isVolumeInfo
      ? book.volumeInfo.imageLinks?.thumbnail
      : book.image;
    const authors = isVolumeInfo ? book.volumeInfo.authors : book.authors;
    const description = isVolumeInfo
      ? book.volumeInfo.description
      : book.description;
    const publisher = isVolumeInfo ? book.volumeInfo.publisher : book.publisher;
    const publishedDate = isVolumeInfo
      ? book.volumeInfo.publishedDate
      : book.publishedDate;
    const pageCount = isVolumeInfo ? book.volumeInfo.pageCount : book.pageCount;
    const categories = isVolumeInfo
      ? book.volumeInfo.categories
      : book.categories;
    const averageRating = isVolumeInfo
      ? book.volumeInfo.averageRating
      : book.averageRating;
    const ratingsCount = isVolumeInfo
      ? book.volumeInfo.ratingsCount
      : book.ratingsCount;
    const previewLink = isVolumeInfo
      ? book.volumeInfo.previewLink
      : book.previewLink;

    const routeToBookDetails = () => {
      const payload = {
        id: bookId,
        volumeInfo: {
          title,
          authors,
          description,
          publisher,
          publishedDate,
          pageCount,
          categories,
          averageRating,
          ratingsCount,
          imageLinks: {
            thumbnail: image,
          },
          previewLink,
        },
      };

      dispatch(setBookDetails({data:payload,cameFrom:isVolumeInfo ?"search" :"reading-list"}));
    };
    return (
      <div
        key={bookId}
        className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col"
      >
        <Link to={`/book/${bookId}`}>
          <img
            className="rounded-t-lg object-contain w-full h-48"
            src={image || DummyImg}
            alt={title}
          />
        </Link>
        <div className="p-5 flex-grow">
          <Link to={`/book/${bookId}`}>
            <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2">
              {title}
            </h5>
          </Link>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-1">
            {authors?.join(", ")}
          </p>
        </div>
        <div className="p-5" onClick={routeToBookDetails}>
        <Link
          to={`/book/${bookId}`}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          View Details
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
        </Link>
        </div>
      </div>
    );
};

export default BookCard;
