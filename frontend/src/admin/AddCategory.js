import React, {useState} from 'react'
import Layout from '../core/Layout'
import {isAuthenticated} from '../auth'
import {Link} from 'react-router-dom'
import {createCategory} from './apiAdmin'


const AddCategory = () => {

  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // destructure user info and token from local storage
  const {user}  = isAuthenticated()


  const handleChange = (e) => {
    setError('')
    setName(e.target.value)
  }

  const clickSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    // make req to API to create category
    createCategory(user._id, {name})
    .then(data=>{
      console.log(data)
      if(data.error){        
        setError(data.error)
      } else{
        setError("")
        setSuccess(true)
      }
    })
  }

  const newCategoryForm = () => (
    <form onSubmit={clickSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input 
        className='form-control' 
        type="text" 
        onChange={handleChange} 
        value={name}
        autoFocus />
      </div>
      <button className="btn btn-outline-primary">
        Create Category
      </button>
    </form>
  )
  
  
  const showSuccess = () => {
    if(success){
    return <h3 className="text-success">{name} is created!</h3>
    }
  }

  const showError= () => {
    if(error){
    return <h3 className="text-danger">{name} {error}</h3>
    }
  }


  const goBack = () => (
    <div className="mt-5">
      <Link to="/admin/dashboard" className="text-warning">
        Back to Dashboard
      </Link>
    </div>
  )

  return (
    <Layout 
    title="Add a new category" 
    description={`G'day ${user.name}, ready to add a new category?`}
    >
      
        <div className='row'>
          <div className="col-md-8 offset-md-2">
            {showError()}
            {showSuccess()}
            {newCategoryForm()}   
            {goBack()}         
          </div>
        </div>
      
    </Layout>  
  )
}

export default AddCategory
