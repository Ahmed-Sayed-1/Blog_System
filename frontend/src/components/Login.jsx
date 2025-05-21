import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Cookies from 'js-cookie'; 
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  // Password strength validation function
  const validatePassword = (value) => {
    let error;
    if (!value) {
      error = 'Required';
    } else if (value.length < 8) {
      error = 'Password must be at least 8 characters';
    } 
    return error;
  };

  // Password strength indicator component
  const PasswordStrength = ({ password }) => {
    if (!password) return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-2xl font-bold text-center mb-6">Welcome to ShopHub</h1>
          <Formik
            initialValues={{ username: '', password: '' }}
            validate={values => {
              const errors = {};
              // Username validation
              if (!values.username) {
                errors.username = 'Required';
              }
              // Password validation
              const passwordError = validatePassword(values.password);
              if (passwordError) errors.password = passwordError;
              
              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                setLoginError('');
                const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    username: values.username,
                    password: values.password
                  }),
                });

                const data = await response.json();

                if (!response.ok) {
                  throw new Error(data.message || 'Login failed');
                }

                // Handle successful login here
                console.log('Login successful:', data.access);
                Cookies.set('access', data.access, { expires: 7 });
                navigate('/posts');
                
              } catch (error) {
                setLoginError(error.message || 'An error occurred during login');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, values }) => (
              <Form>
                {loginError && (
                  <div className="alert alert-error mb-4">
                    <span>{loginError}</span>
                  </div>
                )}
                {/* Username Field */}
                <div className="form-control">
                  <label className="label" htmlFor="username">
                    <span className="label-text">Username</span>
                  </label>
                  <Field 
                    type="text" 
                    name="username" 
                    className="input input-bordered w-full"
                    placeholder="Enter your username"
                  />
                  <ErrorMessage name="username" component="div" className="text-error text-sm mt-1" />
                </div>

                {/* Password Field */}
                <div className="form-control mt-4">
                  <label className="label" htmlFor="password">
                    <span className="label-text">Password</span>
                  </label>
                  <Field 
                    type="password" 
                    name="password" 
                    className="input input-bordered w-full"
                    placeholder="••••••••"
                  />
                  <PasswordStrength password={values.password} />
                  <ErrorMessage name="password" component="div" className="text-error text-sm mt-1" />
                </div>

                {/* Submit Button */}
                <div className="form-control mt-6">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn btn-primary bg-gradient-to-r from-primary to-secondary text-white border-0"
                  >
                    {isSubmitting ? (
                      <span className="loading loading-spinner"></span>
                    ) : 'Login'}
                  </button>
                </div>

                <div className="text-center mt-4">
                  <Link to="/register" className="link link-hover text-sm">Register Now!</Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;