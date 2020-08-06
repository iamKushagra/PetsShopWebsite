import React, {useState, useEffect} from 'react'
import Card from './Card'
import {getCategories, list} from './apiCore'
import {checkForItemInCart} from './cartHelpers'

const Search = ({props, setCartQuantity}) => {

  const [data, setData]=useState({
    categories: [],
    category: '',
    search: '', 
    results: [],
    searched: false
  })

  const { categories, category, search, results, searched } = data

  const loadCategories = () => {
    getCategories().then(data => {
      if(data.error){
        console.log(data.error)
      } else{
        setData({...data, categories: data})
      }
    })
  }

  useEffect(()=>{
    loadCategories()
  },[])

  useEffect(()=>{
    searchData()
  },[category, search])

  const searchData = () => {
    console.log('search, category',search, category)
    if(search || category){
      list({search: search || undefined, category: category })
      .then(response => {
        if(response.error){
          console.log(response.error)
        } else{
          setData({...data, results: response, searched: true})
        }
      })
    }

  }


  const searchSubmit = (e) => {
    e.preventDefault()
    searchData()
  }
  
  const handleChange = (name) => event => {
    setData({...data, [name]: event.target.value, searched: false})
    
    
  }

  const searchMessage = (searched, results) => {
    if(searched && results.length > 0){
      return `Found ${results.length} products`
    }
    if(searched && results.length < 1){
      return `No products found`
    }
  }

  const searchResults = (results = []) => {  
      return (
      <div>
        <h2 className='mt-4 mb-4'>
          {searchMessage(searched, results)}
        </h2>
        <div className='row'>
          {results.map((product, i)=>(
            <div className='col-xl-2 col-lg-4 col-md-6 col-sm-12 mb-3' key={i}>
              <Card 
              props={props} 
              product={product} 
              itemInCart={checkForItemInCart(product._id)} 
              setCartQuantity={setCartQuantity}
            />
            </div>
          ))}
        </div>
      </div>
  )}

  const searchForm = () => (
    <form onSubmit={searchSubmit}>
      <span className="input-group-text">
        <div className="input-group input-group-lg">
          <div className="input-group-prepend">
            <select onChange={handleChange('category')} name="category" id="" className="btn mr-2">
              <option value="All">All</option>
              {categories && categories.map((c,i)=>(
                <option key={i} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        <input 
        type="search"
        name="search"
        onChange={handleChange('search')}  
        className="form-control"
        placeholder='Search by Name'
        />
        </div>
        <div className="btn input-group-append" style={{border: 'none'}}>
          <button className="input-group-text">Search</button>
        </div>
      </span>
    </form>
  )

  
  return (
    <div className='row'>
      <div className='container mb-3'>{searchForm()}</div>      
      <div className="container-fluid mb-3">
        {searchResults(results)}
      </div>
    </div>
  )
}

export default Search
