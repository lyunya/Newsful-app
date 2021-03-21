import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import logo from '../../images/articles-image.svg'
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


  return (
    <div className='login-wrapper'>
      <div className='login-content'>
    <h1 className='app-title-login'>Newsful</h1>
    <img className='article-logo' src={logo} alt='article logo'/>
    <div className='login'>
      <div className='intro'>
        <p className='intro-lead'>
          Whose views are in your news? </p>
          <p>
          Many news sources have a political agenda behind their reporting, but
          the Newsful app helps you identify the bias and expose you to a
          variety of sources.{' '}
        </p>
        <p>
          Read articles from all sides of the political spectrum and save news
          stories to read later.
        </p>
     
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ touched, errors }) => (
          <Form className='form-group'>
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
      <p>Test Account <br /> Email: demo@demo.com <br /> Password: T@pwater1</p>
      <div className='register-button'>
    <Link
        to='/registration'
        style={{ textDecoration: 'none' }}
        className='registrationPageLink'
      >
        <button>Register</button>
      </Link>
      </div>
      </div>
    </div>
      </div>
    </div>
  );
};

export default LoginForm;
