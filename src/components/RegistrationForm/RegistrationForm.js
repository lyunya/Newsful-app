import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AuthApiService from '../../services/auth-api-services';
import './RegistrationForm.css';

const RegistrationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address format')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be 8 characters at minimum')
    .required('Password is required'),
});

const RegistrationForm = () => {
  const [error, setError] = useState(null);

  const handleSubmit = (values) => {
    AuthApiService.postUser({
      email: values.email,
      password: values.password,
    })
      .then((res) => {
        setError(null);
        this.props.history.push('/');
      })
      .catch((res) => {
        setError(res.error);
      });
  };

  return (
    <>
      <div className='registration-wrapper'>
        <div className='Intro'>
          <h1>Newsful</h1>
        </div>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={RegistrationSchema}
          onSubmit={(values) => handleSubmit(values)}
        >
          {({ touched, errors, isSubmitting }) => (
            <Form>
              <div className='form-group'>
                <label htmlFor='email' />
                <Field
                  type='email'
                  name='email'
                  aria-label='Enter email address'
                  placeholder='Email'
                  className={`form-control ${
                    touched.email && errors.email ? 'is-invalid' : ''
                  }`}
                />
                <ErrorMessage
                  component='div'
                  name='email'
                  className='invalid-feedback'
                />
              </div>

              <div className='form-group'>
                <label htmlFor='password' />
                <Field
                  type='password'
                  name='password'
                  aria-label='Enter password'
                  placeholder='Password'
                  className={`form-control ${
                    touched.password && errors.password ? 'is-invalid' : ''
                  }`}
                />
                <ErrorMessage
                  component='div'
                  name='password'
                  className='invalid-feedback'
                />
              </div>

              <button type='submit' className='create-btn'>
                Create an Account
              </button>
            </Form>
          )}
        </Formik>
        {error ? <p>{error}</p> : null}
        <p>After creating an account, please log in with your credentials</p>
        <p>
          Already a user?{' '}
          <Link to='/' style={{ textDecoration: 'none' }}>
            <button>Log in</button>
          </Link>
        </p>
      </div>
    </>
  );
};

export default RegistrationForm;
