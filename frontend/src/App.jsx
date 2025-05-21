import { BrowserRouter, Route, Routes, Navigate }from 'react-router-dom'
import NavBar from './components/Navbar'
import { useState, useEffect } from 'react'
// import './App.css'
import Login from './components/Login'
import Register from './components/Register'
import Posts from './components/posts'
import AddPosts from './components/AddPost'
import NotFound from './components/NotFound'
import Cookies from 'js-cookie'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = Cookies.get('access');
    setIsAuthenticated(!!token);
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  // Auth route component (redirect if already logged in)
  const AuthRoute = ({ children }) => {
    if (isAuthenticated) {
      return <Navigate to="/posts" />;
    }
    return children;
  };

  return (
    <>
        <BrowserRouter>
        <NavBar/>
        <Routes>
          <Route path='/' element={<Posts/>}/>
          <Route path='/login' element={
            <AuthRoute>
              <Login/>
            </AuthRoute>
          }/>
          <Route path='/posts' element={<Posts/>}/>
          <Route path='/add-post' element={
            <ProtectedRoute>
              <AddPosts/>
            </ProtectedRoute>
          }/>
          <Route path='/register' element={
            <AuthRoute>
              <Register/>
            </AuthRoute>
          }/>
          <Route path='*' element={<NotFound />} />
        </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
