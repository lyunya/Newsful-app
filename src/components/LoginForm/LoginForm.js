import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AuthApiService from '../../services/auth-api-services';
import TokenService from '../../services/token-service';
import './LoginForm.css';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address format')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be 8 characters at minimum')
    .required('Password is required'),
});

const LoginForm = (props) => {
  const handleSubmit = (values) => {
    AuthApiService.postLogin({
      email: values.email,
      password: values.password,
    }).then((res) => {
      props.setUserId(res.userId);
      localStorage.setItem('userId', res.userId);
      TokenService.saveAuthToken(res.authToken);
      props.history.push('/home');
    });
  };

  //  const { error } = this.state;
  return (
    <div className='loginWrapper'>
      <div className='Intro'>
        <h1>Welcome to Newsful</h1>
        <p>
          Whose views are in your news? <br />
          Many news sources have a political agenda behind their reporting, but
          the Newsful app helps you identify the bias and expose you to a
          variety of sources.{' '}
        </p>
        <p>
          Read articles from all sides of the political spectrum and save news
          stories to read later
        </p>
      </div>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ touched, errors }) => (
          <Form>
            <div className='form-group'>
              <label htmlFor='email' />
              <Field
                type='email'
                name='email'
                aria-label='Enter email address'
                placeholder='Email'
                autoComplete='username'
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
                autoComplete='current-password'
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

            <button type='submit' className='signin-btn'>
              Sign In
            </button>
          </Form>
        )}
      </Formik>

      <p>test account - email: demo@demo.com & password: T@pwater1</p>
      <Link
        to='/registration'
        style={{ textDecoration: 'none' }}
        className='registrationPageLink'
      >
        <button>Register</button>
      </Link>
    </div>
  );
};

export default LoginForm;
