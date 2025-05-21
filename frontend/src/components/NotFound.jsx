import React from 'react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
      <img
        src="https://admiral.digital/wp-content/uploads/2023/08/404_page-not-found.png"
        alt="404 Not Found"
        className="max-w-full w-[500px] mb-8"
      />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <a
        href="/"
        className="inline-block bg-primary text-white px-6 py-2 rounded-lg shadow hover:bg-primary/80 transition duration-300"
      >
        Go Back Home
      </a>
    </div>
  );
}
