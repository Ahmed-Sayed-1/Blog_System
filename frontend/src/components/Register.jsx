import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [registerError, setRegisterError] = useState('');
  const navigate = useNavigate();

  const validatePassword = (value) => {
    let error;
    if (!value) {
      error = 'Required';
    } else if (value.length < 8) {
      error = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(value)) {
      error = 'Must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(value)) {
      error = 'Must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(value)) {
      error = 'Must contain at least one number';
    } else if (!/[^A-Za-z0-9]/.test(value)) {
      error = 'Must contain at least one special character';
    }
    return error;
  };

  const PasswordStrength = ({ password }) => {
    if (!password) return null;
    
    const strength = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
    
    const strengthScore = Object.values(strength).filter(Boolean).length;
    const strengthText = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'][strengthScore - 1];
    const strengthColor = ['error', 'error', 'warning', 'success', 'success'][strengthScore - 1];

    return (
      <div className="mt-2">
        <div className="flex gap-1 mb-1">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i <= strengthScore ? `bg-${strengthColor}` : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <span className={`text-xs text-${strengthColor}`}>
          Password Strength: {strengthText}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <div className="card w-full max-w-2xl bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-2xl font-bold text-center mb-6">Create Your ShopHub Account</h1>
          <Formik
            initialValues={{
              username: '',
              email: '',
              password: '',
              confirmPassword: '',
              phone: '',
              address: ''
            }}
            validate={values => {
              const errors = {};
              
              // Username validation
              if (!values.username) {
                errors.username = 'Required';
              } else if (values.username.length < 3) {
                errors.username = 'Username must be at least 3 characters';
              }

              // Email validation
              if (!values.email) {
                errors.email = 'Required';
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = 'Invalid email address';
              }

              // Password validation
              const passwordError = validatePassword(values.password);
              if (passwordError) errors.password = passwordError;

              // Confirm Password validation
              if (values.password !== values.confirmPassword) {
                errors.confirmPassword = 'Passwords must match';
              }

              // Phone validation
              if (!values.phone) {
                errors.phone = 'Required';
              } else if (!/^[0-9]{10,15}$/.test(values.phone)) {
                errors.phone = 'Invalid phone number (10-15 digits)';
              }

              // Address validation
              if (!values.address) {
                errors.address = 'Required';
              } else if (values.address.length < 10) {
                errors.address = 'Address too short';
              }

              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                setRegisterError('');
                const response = await fetch('http://127.0.0.1:8000/api/auth/register/', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    username: values.username,
                    email: values.email,
                    password: values.password
                  }),
                });

                const data = await response.json();

                if (!response.ok) {
                  throw new Error(data.message || 'Registration failed');
                }

                // Handle successful registration
                console.log('Registration successful:', data);
                navigate('/login');
                
              } catch (error) {
                setRegisterError(error.message || 'An error occurred during registration');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, values }) => (
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {registerError && (
                  <div className="alert alert-error mb-4 md:col-span-2">
                    <span>{registerError}</span>
                  </div>
                )}
                {/* Username */}
                <div className="form-control">
                  <label className="label" htmlFor="username">
                    <span className="label-text">Username</span>
                  </label>
                  <Field 
                    type="text" 
                    name="username" 
                    className="input input-bordered w-full"
                    placeholder="shopuser123"
                  />
                  <ErrorMessage name="username" component="div" className="text-error text-sm mt-1" />
                </div>

                {/* Email */}
                <div className="form-control">
                  <label className="label" htmlFor="email">
                    <span className="label-text">Email</span>
                  </label>
                  <Field 
                    type="email" 
                    name="email" 
                    className="input input-bordered w-full"
                    placeholder="your@email.com"
                  />
                  <ErrorMessage name="email" component="div" className="text-error text-sm mt-1" />
                </div>

                {/* Password */}
                <div className="form-control">
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

                {/* Confirm Password */}
                <div className="form-control">
                  <label className="label" htmlFor="confirmPassword">
                    <span className="label-text">Confirm Password</span>
                  </label>
                  <Field 
                    type="password" 
                    name="confirmPassword" 
                    className="input input-bordered w-full"
                    placeholder="••••••••"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-error text-sm mt-1" />
                </div>

                {/* Phone */}
                <div className="form-control">
                  <label className="label" htmlFor="phone">
                    <span className="label-text">Phone Number</span>
                  </label>
                  <Field 
                    type="tel" 
                    name="phone" 
                    className="input input-bordered w-full"
                    placeholder="1234567890"
                  />
                  <ErrorMessage name="phone" component="div" className="text-error text-sm mt-1" />
                </div>

                {/* Address - spans both columns */}
                <div className="form-control md:col-span-2">
                  <label className="label" htmlFor="address">
                    <span className="label-text">Address</span>
                  </label>
                  <Field 
                    as="textarea" 
                    name="address" 
                    className="textarea textarea-bordered w-full"
                    placeholder="123 Main St, City, Country"
                    rows={3}
                  />
                  <ErrorMessage name="address" component="div" className="text-error text-sm mt-1" />
                </div>

                {/* Submit Button */}
                <div className="form-control md:col-span-2 mt-4">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn btn-primary bg-gradient-to-r from-primary to-secondary text-white border-0"
                  >
                    {isSubmitting ? (
                      <span className="loading loading-spinner"></span>
                    ) : 'Register'}
                  </button>
                </div>

                <div className="text-center md:col-span-2 mt-2">
                  <p className="text-sm">
                    Already have an account? <Link to="/login" className="link link-hover text-primary">Login here</Link>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Register;