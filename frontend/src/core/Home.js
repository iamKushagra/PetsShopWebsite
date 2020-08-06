/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react'
import {useChain, animated, useSpring, useTransition} from 'react-spring'
import Layout from './Layout'
import {getProducts} from './apiCore'
import {checkForItemInCart, itemTotal} from './cartHelpers'
import Card from './Card'
import Search from './Search'
import LoaderOne from './LoaderOne'

const Home = (parentProps) => {

  const [productsBySell, setProductsBySell] = useState([])
  const [productsByArrival, setProductsByArrival] = useState([])
  const [error, setError] = useState([]) 
  const [cartQuantity, setCartQuantity] = useState(itemTotal())
  const [refreshCart, setRefreshCart] = useState(false)
  // Build a transition for byArrivals
  const transitionsArrival = useTransition(productsByArrival.length ? productsByArrival : [], item => item._id, {
    unique: true,
    trail: 80,
    from: {opacity: 0, transform: 'scale(0)'},
    enter: {opacity: 1, transform: 'scale(1)'},
    leave: {opacity: 0, transform: 'scale(0)'}
  })
  // Build a transition for bySell
  const transitionsBySell = useTransition(productsBySell.length ? productsBySell : [], item => item._id, {
    unique: true,
    trail: 80,
    from: {opacity: 0, transform: 'scale(0)'},
    enter: {opacity: 1, transform: 'scale(1)'},
    leave: {opacity: 0, transform: 'scale(0)'}
  })

  const loadProductsBySell = ()=>{
    getProducts('sold')
    .then(data=>{
      if(data.error){
        setError(data.error)
        console.log('Home.js loadProductBySell Error: ', error)
      } else{
        setProductsBySell(data)
      }
    })
  }

  const loadProductsByArrival = ()=>{
    getProducts('createdAt')
    .then(data=>{
      if(data.error){
        setError(data.error)
      } else{
        setProductsByArrival(data)
      }
    })
  }


  useEffect(()=>{
    loadProductsByArrival()
    loadProductsBySell()
  },[refreshCart])

  

  return (
    <Layout 
    className='container-fluid' 
    title="Home Page" 
    cartQuantity={cartQuantity}
    description="Pets World Shop, Patna">
      <Search 
      props={parentProps} 
      setCartQuantity={setCartQuantity}
      />
      <h2 className='mb-4'>New Arrivals</h2>
      
      <div className="row">
      {productsByArrival.length ? 
      
      transitionsArrival.map(({item, key, props})=>{
        /* console.log('ITEM: ', item, 'KEY: ', key, 'PROPS: ', props)
        console.log(key) */
        return(
        <animated.div style={props} className='col-xl-2 col-lg-4 col-md-6 col-sm-12 mb-3' key={key}>
          <Card 
          props={parentProps} 
          product={item}
          itemInCart={checkForItemInCart(item._id)} 
          showAddToCartButton={item.quantity > 0}
          showChangeQuantityButtons={item.quantity > 0}
          setCartQuantity={setCartQuantity}
          setRefreshCart={setRefreshCart}
          refreshCart={refreshCart}
          />
        </animated.div>)
      })
      
      : <LoaderOne />}
      
      </div>
      
      <h2 className='mb-4'>Best Sellers</h2>
      <div className="row">
      {productsBySell.length ? 
      transitionsBySell.slice(0).reverse().map(({item, key, props})=>(
        <animated.div style={props} className='col-xl-2 col-lg-4 col-md-6 col-sm-12 mb-3' key={key}>
          {console.log('!!!!!!!!!!!BEST SELLER!!!!!!!!!!!!!!!!!')}
          <Card 
          props={parentProps} 
          product={item}
          itemInCart={checkForItemInCart(item._id)}
          showAddToCartButton={item.quantity > 0}
          showChangeQuantityButtons={item.quantity > 0} 
          setCartQuantity={setCartQuantity}
          setRefreshCart={setRefreshCart}
          refreshCart={refreshCart}
          />
        </animated.div>
      ))
      : <LoaderOne />
      }
      </div>
    </Layout>
     
  )
}

export default Home
