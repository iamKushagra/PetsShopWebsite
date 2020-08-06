import React, {useState} from 'react'
import Layout from '../core/Layout'
import {signup} from '../auth/index'

const SignUp = () => {
  
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    error: '',
    success: false
  })

  
  const {name, email, password, success, error} = values

  const handleChange = name => event => {
    setValues({...values, error: false, [name]: event.target.value})
  }

  

  const clickSubmit =  (event) => {
    event.preventDefault()
    signup({name, email, password})
    .then(data=>{      
      if(data.error){
        console.log('DATA: ', data)
        setValues({...values, error: data.error, success: false})
      } else{
        setValues({...values, 
          name: '',
          email: '',
          password: '',
          error: '',
          success: true
        })
      }
    })
  }

  const signUpForm = () => (
    <form>
      <div className="form-group">
        
        <label className="text-muted">Name</label>
        <input onChange={handleChange('name')} type="text" className='form-control' value={name}/>
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input onChange={handleChange('email')}  type="email" className='form-control' value={email}/>
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input onChange={handleChange('password')} type="password" className='form-control' value={password}/>
      </div>
      <button onClick={clickSubmit} className="btn btn-primary">
        Submit
      </button>
    </form>
  )

  const showError = () => (
    <div className="alert alert-danger" style={{display: error ? '': 'none'}}>{error}</div>
  )

  const showSuccess = () => (
    <div className="alert alert-info" style={{display: success ? '': 'none'}}>
      New account succefully created. Please sign in. 
    </div>
  )
  return (
    <Layout 
    title="Sign Up" 
    description="Sign up for Pets World Shop, Patna" 
    className='container col-md-8 offset-md-2'>
      {showError()}
      {showSuccess()}
      {signUpForm()}    
    </Layout>
  )
}

export default SignUp
