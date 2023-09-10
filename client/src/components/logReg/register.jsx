import React, { useState, useEffect } from 'react';
import { TextField, Grid, Button } from '@mui/material';
import './logReg.css'

import { ADD_COMPANY } from '../../utils/mutations';
import { useMutation } from '@apollo/client';

const Register = () => {

  // const [inputs, setInputs] = useState({
  //   companyName: '',
  //   name: '',
  //   email: '',
  //   password: ''
  // })

  const [inputs, setInputs] = useState({
    name: '',
    type: '',
    logo: ''
  })

  const [addCompany, { error }] = useMutation(ADD_COMPANY);
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(inputs)

    try {
      const { data } = await addCompany({
          variables: { ...inputs },
      });
      console.log(data);

  } catch (err) {
      console.error(err);
      setShowAlert(true);
  }



    // setInputs({
    //   companyName: '',
    //   name: '',
    //   email: '',
    //   password: ''
    // });

    setInputs({
      name: '',
      type: '',
      logo: ''
    });

  };

  return (
    <Grid 
    container 
    spacing={2}
    justifyContent='center'
    alignItems='center'
    style={{ minHeight: '100vh' }}
    >

    <Grid item xs={12} sm={6} className="form-container">
      <form onSubmit={handleSubmit}>

      <TextField
      name='name'
      value={inputs.name}
      onChange={handleChange}
      type={'text'}
      placeholder='Company Name'
      variant='outlined'
      fullWidth
      margin='normal'
      />

      <TextField
      name='type'
      value={inputs.type}
      onChange={handleChange}
      type={'text'}
      placeholder='Company Type'
      variant='outlined'
      fullWidth
      margin='normal'
      />

      <TextField
      name='logo'
      value={inputs.logo}
      onChange={handleChange}
      type={'text'}
      placeholder='Company Logo'
      variant='outlined'
      fullWidth
      margin='normal'
      />

      {/* <TextField
      name='companyName' 
      value={inputs.companyName}
      onChange={handleChange}
      type={'text'} 
      placeholder='Company Name' 
      variant='outlined'
      fullWidth
      margin='normal'
      />

      <TextField
      name='name' 
      value={inputs.name} 
      onChange={handleChange} 
      type={'text'} 
      placeholder='Your name' 
      variant='outlined'
      fullWidth
      margin='normal'
      />

      <TextField
      name='email' 
      value={inputs.email} 
      onChange={handleChange} 
      type={'email'} 
      placeholder='Email' 
      variant='outlined'
      fullWidth
      margin='normal'
      />

      <TextField
      name='password' 
      value={inputs.password} 
      onChange={handleChange}
      type={'password'} 
      placeholder='Password' 
      variant='outlined'
      fullWidth
      margin='normal'
      /> */}


      <Grid container justifyContent="center">
        <Button 
          type="submit" 
          variant="contained" 
          color='primary'
          className="submit-button">
            Register
        </Button>
      </Grid>


      </form>
    </Grid>
    </Grid>
  );
};

export default Register;