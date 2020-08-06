/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react'
import Layout from './Layout'
import Card from './Card'
import {getCategories, getFilteredProducts} from './apiCore'
import {checkForItemInCart, itemTotal} from './cartHelpers'
import Checkbox from './Checkbox'
import RadioBox from './RadioBox'
import LoaderOne from './LoaderOne'
import {prices} from './fixedPrices'

const Shop = (props) => {
  // set by user input
  const [myFilters, setMyfilters] = useState({
    filters: {category: [], price: []}
  })
  // set by backend code
  const [categories, setCategories] = useState([])
  const [error, setError] = useState([])
  const [limit, setLimit] = useState(6)
  const [skip, setSkip] = useState(0)
  const [size, setSize] = useState(0)
  const [filteredResults, setFilteredResults] = useState([])
  const [noResult, setNoResult] = useState(false)
  const [cartQuantity,setCartQuantity] = useState(0)
  const [refreshCart, setRefreshCart] = useState(false)
  console.log('categories: ',categories)

  // @init: get all the categories when the page loads. Then, initially there are no filters, so loadFilteredResults/getFilteredProducts returns all products with a limit of 6 products and no skips
  // after, loadMore will add the limit to the skip and set the new skip to that sum.
  const init = () => { 
    getCategories().then(data => {
      if(data.error){        
        setError(data.error)
        console.log('ERROR AddProduct.js init: ', error)
      } else {
        setCategories(data)
        loadFilteredResults(myFilters.filters)
        setCartQuantity()
      }
    })
  }
  useEffect(()=>{
    init()
  },[])

  const handlePrice = (id)=> {
    const data = prices
    let array = []    
    for(let index in data){
      if(data[index]._id === parseInt(id)){
        array = data[index].array
      }
    }
    return array
  }


  // filters/filterBy can be either category or price
  const handleFilters = (filters, filterBy) => {
    console.log('Shop.js handleFilters: ',filters, filterBy)

    const newFilters = {...myFilters}

    if(filterBy === 'price'){
      console.log('price Filter: ', filters)
      let priceValues = handlePrice(filters)
      newFilters.filters[filterBy] = priceValues
    } else{
      newFilters.filters[filterBy] = filters
    }
    loadFilteredResults(myFilters.filters)
    setMyfilters(newFilters)
  }
  console.log('myFilters', myFilters)
  console.log('Shop.js filteredResults: ', filteredResults)

  /* useEffect(()=>{
    setRefreshCart(!refreshCart)
  },[handleFilters]) */


  const loadFilteredResults = (newFilters) => {
    console.log('loadFilteredResults: ',newFilters)
    getFilteredProducts(skip, limit, newFilters)
    .then(data=>{
      if(data.error){
        setError(data.error)
      } else{
        console.log('loadFilteredResults data: ', data)
        
        setFilteredResults(data.data)
        setSize(data.size)
        setSkip(0)
        if(data.size === 0){
          setTimeout(()=>{
            setNoResult(true)
          }, 2000)
        }
      }
    })
  }

  const loadMore = () => {
    let toSkip = skip + limit
    getFilteredProducts(toSkip, limit, myFilters.filters)
    .then(data=>{
      if(data.error){
        setError(data.error)
      } else{
        console.log('loadMore data: ', data.data)
        
        setFilteredResults([...filteredResults, ...data.data])
        setSize(data.size)
        setSkip(toSkip)
      }
    })
  }

  const loadMoreButton = () => {
    return (
      size > 0 && size >= limit && (
        <button onClick={loadMore} className='btn btn-warning mb-5'>Load More</button>
      )
    )
  }

  

  
  return (
    <Layout 
    className='container-fluid' 
    title="Shop" 
    cartQuantity={cartQuantity}
    description="Pets World Shop, Patna">
      <div className="row">
        <div className="col-xl-4"> 
          <div className="row">
            <div className="col-xl-12 col-sm-6">
            <h4>Filter by Categeory</h4>
              <ul>
              <Checkbox categories={categories} handleFilters={handleFilters} />
              </ul>
            </div>
            <div className="col-xl-12 col-sm-6">
            <h4>Filter by Price</h4>
            <div>
              <RadioBox prices={prices} handleFilters={handleFilters}  />
            </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-8">
          <h2 className='mb-4'>Search Results</h2>
          <div className='row'>
            {filteredResults.length > 0 ? filteredResults.map((product,i)=>(
              <div className='col-lg-6 col-sm-12 mb-3' key={i}>
                <Card 
                props={props} 
                product={product}
                itemInCart={checkForItemInCart(product._id)}
                showAddToCartButton={product.quantity > 0}
                showChangeQuantityButtons={product.quantity > 0}
                setCartQuantity={setCartQuantity}
                
                />
              </div>
            ))
          : <LoaderOne 
            waitingMessage='Searching for your products...'
            noResult={noResult}
            noResultMessage={`Hmm. We don't seem to have anyhthing matching your filters.`}
            />
          }            
          </div>
          <hr/>
          {loadMoreButton()}
        </div>
      </div>

    </Layout>
  )
}

export default Shop
