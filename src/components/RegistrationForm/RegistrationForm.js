import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import regLogo from '../../images/register-image.svg';
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
        <h1 className='app-name-registration'>Newsful</h1>
        <img
          className='registration-logo'
          src={regLogo}
          alt='registration logo'
        />
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
        <p className='registration-details'>
          After creating an account, please log in with your credentials 
          <br />
          Already a user?
        </p>
        <Link to='/' style={{ textDecoration: 'none' }}>
          <button className='signin-btn'>Log in</button>
        </Link>
      </div>
    </>
  );
};

export default RegistrationForm;
