/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react'
import Layout from '../core/Layout'
import {isAuthenticated} from '../auth'
import {createProduct, getCategories} from './apiAdmin'




const AddProduct = () => {

  const [values, setValues] = useState({
    name: '',
    description: '',
    specification: '',
    Manufacturer:'',
    size: '',
    lifespan:'',
    weight:'',
    price: '',
    categories: [],
    category: '',
    shipping: '',
    quantity: '',
    photo: '',
    loading: false,
    error: '',
    createdProduct: '',
    redirectToProfile: false,
    formData: ''
  })

  const {
  name,
  description,
  specification,
  Manufacturer,
  size,
  lifespan,
  weight,
  price,
  categories, 
  quantity,  
  loading,
  error,
  createdProduct,
  formData
  } = values

  const {user} = isAuthenticated()
  
  const init = () => { 
    getCategories().then(data => {
      if(data.error){
        console.log('ERROR AddProduct.js init')
        setValues({...values, error: data.error})
      } else {
        setValues({...values, categories: data, formData: new FormData(), error: ''})
      }
    })
  }


  useEffect(()=>{
    init()
  },[])

  const handleChange = name => event => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value
    formData.set(name, value)
    setValues({...values, [name]: value})
  }


  const clickSubmit = (e) => {
    e.preventDefault()
    setValues({...values, error: "", loading: true})
    createProduct(user._id, formData)
    .then(data=>{
      if(data.error){
        console.log('ERROR AddProduct.js clickSubmit')
        setValues({...values, error: data.error})
      } else{ 
        console.log('DATA CLICK SUBMIT: ', data)
        setValues({...values, name: '', description: '', photo: '', price: '', quantity: '', loading: false, createdProduct: data.product.name})
      }
    })
  }

  const newPostForm = () => (
    <form onSubmit={clickSubmit} className="mb-3">
      <h4>Post Photo</h4>
      <div className="form-group">
        <label className="btn btn-secondary" htmlFor="">
          <input onChange={handleChange('photo')}  type="file" name="photo" accept="image/*"/>
        </label>        
      </div>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input 
        onChange={handleChange('name')} 
        type="text"
        className='form-control'
        value={name}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Description</label>
        <textarea 
        onChange={handleChange('description')} 
        type="text"
        value={description}
        className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Specification</label>
        <textarea 
        onChange={handleChange('specification')} 
        type="text"
        value={specification}
        className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Manufacturer</label>
        <input 
        onChange={handleChange('Manufacturer')} 
        type="text"
        value={Manufacturer}
        className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Size</label>
        <input 
        onChange={handleChange('size')} 
        type="text"
        value={size}
        className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">LifeSpan</label>
        <input 
        onChange={handleChange('lifespan')} 
        type="text"
        value={lifespan}
        className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Weight</label>
        <input 
        onChange={handleChange('weight')} 
        type="text"
        value={weight}
        className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Price</label>
        <input 
        onChange={handleChange('price')} 
        type="number"
        value={price}
        className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Category</label>
        <select
        onChange={handleChange('category')} 
        className='form-control'
        >

        <option value="">Please Select</option>
          {categories && categories.map((c, i)=>(
            <option key={i} value={c._id} >{c.name}</option>
          ))}

        </select>
      </div>
      <div className="form-group">
        <label className="text-muted">Shipping</label>
        <select
          onChange={handleChange("shipping")}
          className="form-control"
        > 
          <option value="">Please Select</option>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>
      </div>
      <div className="form-group">
        <label className="text-muted">Quantity</label>
        <input 
        onChange={handleChange('quantity')} 
        type="number"
        value={quantity}
        className="form-control"
        />
      </div>
      <button className="btn btn-outline-primary">Create Product</button>
    </form>
  )


  const showError = () => (
    <div className='alert alert-danger' style={{display: error ? '' : 'none'}} >{error}</div>
  )

  const showSuccess= () => (
    <div className='alert alert-success' style={{display: createdProduct ? '' : 'none'}} ><h2>{`${createdProduct} is created!`}</h2></div>
  )

  const showLoading = () => (
    loading && (<div className='alert alert-success'><h2>Loading...</h2></div>)
  )

  
  return (
    <Layout 
    title="Add a new product" 
    description={`G'day ${user.name}, ready to add a new product?`}
    >
      <div className='row'>
        <div className="col-md-8 offset-md-2">
          {showError()}
          {showLoading()}
          {showSuccess()}
          {newPostForm()} 
        </div>
      </div> 
    </Layout>  
  )
}

export default AddProduct
