import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const postsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('access');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded["user_id"]);
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }

    fetchPosts(token, 1, true);
  }, []);

  const fetchPosts = async (token, pageNum, isInitial = false) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Assuming your API supports pagination with limit and offset params
      const limit = postsPerPage;
      const offset = (pageNum - 1) * postsPerPage;
      
      const response = await fetch(`http://127.0.0.1:8000/posts?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: headers
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      
      // If your API returns a different structure, adjust this accordingly
      // Assuming data is an array of posts
      if (isInitial) {
        setPosts(data);
      } else {
        setPosts(prevPosts => [...prevPosts, ...data]);
      }
      
      // If returned less than the requested number, there are no more posts
      setHasMore(data.length === postsPerPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    const token = Cookies.get('access');
    fetchPosts(token, nextPage);
  };

  const handleEdit = (post) => {
    navigate('/add-post', { state: { isEditing: true, post } });
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const accessToken = Cookies.get('access');

      const response = await fetch(`http://127.0.0.1:8000/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete post');

      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading && posts.length === 0) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-auto my-10 max-w-4xl rounded shadow-md">
      <p className="font-bold">Error</p>
      <p>{error}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Posts</h1>
        {currentUserId && (
          <Link 
            to="/add-post" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow-md transition duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Post
          </Link>
        )}
      </div>
      
      {posts.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg shadow-sm">
          <p className="text-gray-600 text-lg">No posts available</p>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={posts.length}
          next={loadMorePosts}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center my-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          }
          endMessage={
            <p className="text-center text-gray-500 my-4">
              You've seen all posts!
            </p>
          }
        >
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
                {post.image_url && (
                  <div className="w-full h-48 overflow-hidden">
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 h-14">{post.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-3 h-18">{post.content}</p>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-sm text-gray-500 italic">By: {post.author_username}</span>
                    
                    {currentUserId === post.author_id && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition duration-200"
                          aria-label="Edit post"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition duration-200"
                          aria-label="Delete post"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}
