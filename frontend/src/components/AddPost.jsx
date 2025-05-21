import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function AddPost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're editing an existing post
  const isEditing = location.state?.isEditing || false;
  const postToEdit = location.state?.post || null;
  const postId = postToEdit?.id;

  // Create validation schema
  const PostSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    content: Yup.string().required('Content is required'),
    image: isEditing ? Yup.mixed() : Yup.mixed().required('Image is required')
  });

  // Initial form values
  const initialValues = {
    title: postToEdit?.title || '',
    content: postToEdit?.content || '',
    image: null
  };

  // Format current date as YYYY-MM-DD
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Upload image to ImgBB using CORS proxy
  const uploadImage = async (imageFile) => {
    // First check if the file exists
    if (!imageFile) {
      throw new Error('No image file provided');
    }

    // Check file size (limit to 5MB for example)
    if (imageFile.size > 5 * 1024 * 1024) {
      throw new Error('Image size must be less than 5MB');
    }

    // Convert file to base64
    const base64Image = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = () => resolve(reader.result.split(',')[1]); // Get only the base64 part
      reader.onerror = error => reject(error);
    });

    // Create a FormData object to send the image
    const formData = new FormData();
    formData.append('key', 'fa17ebd1261f90ab74b4205cb02f0565');
    formData.append('image', base64Image);

    try {
      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to upload image');
      }

      const data = await response.json();
      console.log('Upload success:', data);
      return data.data.url;
    } catch (err) {
      console.error('Image upload error:', err);
      throw new Error('Image upload failed: ' + err.message);
    }
  };

  // Handle image change
  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setFieldValue('image', file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {isEditing ? 'Edit Post' : 'Add New Post'}
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <Formik
        initialValues={initialValues}
        validationSchema={PostSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setLoading(true);
          setError(null);

          try {
            let imageUrl = postToEdit?.image_url;

            // Upload image if it exists
            if (values.image) {
              imageUrl = await uploadImage(values.image);
            }

            // Get access token from cookies
            const accessToken = Cookies.get('access');
            
            // Create headers with authentication
            const headers = {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            };
            console.log(imageUrl);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
            const postData = {
              title: values.title,
              content: values.content,
              date: getCurrentDate(),
              image_url: imageUrl
            };

            let url = 'http://127.0.0.1:8000/posts';
            let method = 'POST';

            // If editing, use PATCH method and include post ID in URL
            if (isEditing && postId) {
              url = `${url}/${postId}`;
              method = 'PATCH';
            }

            const response = await fetch(url, {
              method: method,
              headers: headers,
              body: JSON.stringify(postData)
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || `Failed to ${isEditing ? 'update' : 'create'} post`);
            }

            // Redirect to posts page after successful submission
            navigate('/posts');
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="bg-white shadow-md rounded-lg p-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                Title
              </label>                                                                                                                                                                                                                                                                                                                                      
              <Field
                id="title"
                name="title"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage name="title" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                Content
              </label>
              <Field
                as="textarea"
                id="content"
                name="content"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
              />
              <ErrorMessage name="content" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                Image
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={(event) => handleImageChange(event, setFieldValue)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage name="image" component="div" className="text-red-500 text-xs mt-1" />
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full max-h-40 object-contain"
                  />
                </div>
              )}
              {postToEdit?.image_url && !imagePreview && (
                <div className="mt-2">
                  <img 
                    src={postToEdit.image_url} 
                    alt="Current" 
                    className="w-full max-h-40 object-contain"
                  />
                  <p className="text-xs text-gray-500 mt-1">Current image</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? 'Submitting...' : (isEditing ? 'Update Post' : 'Create Post')}
              </button>
              <button
                type="button"
                onClick={() => navigate('/posts')}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            