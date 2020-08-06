/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react'
import {Link, Redirect} from 'react-router-dom'
import AdminControls from '../admin/DeleteUpdateBtns'
import Image from './ShowImage'
import moment from 'moment'
import {addItem, updateItem, removeItem, checkForItemInCart, itemTotal} from './cartHelpers'
import {isAuthenticated} from '../auth'
const Card = ({
  props,
  product,
  setCartQuantity=()=>{console.log('UNPASSED PROP: setCartQuantity in Card.js. You need to pass this function down to Card.js. This is the default function')},
  itemInCart=false,
  showViewProductButton = true, 
  showAddToCartButton = true, 
  showChangeQuantityButtons=true, 
  showRemoveProductButton=true,
  showAdminControls=false,
  onCartPage=false,
  setRefreshCart=function(z){ console.log(z)},
  refreshCart=false
}) => {
  
  //console.log(product)
  const [redirect, setRedirect] = useState(false)
  const [count, setCount] = useState(0)
  const [buttonDisplay, setButtonDisplay] = useState({
    showViewProductButton,
    showAddToCartButton,
    showChangeQuantityButtons,
    showRemoveProductButton,
    showAdminControls,
    itemInCart

  })
  console.log('ITEM IN CART :', itemInCart)  
  // this useEffect listens to the props itemInCart which is a number >= 0 not the state itemInCart
  useEffect(()=>{
    setCount(itemInCart)
    setButtonDisplay({
      ...buttonDisplay,
      itemInCart: itemInCart
    })
  },[refreshCart])

  // redirects to same page to refresh state
  //const refreshRedirect = () => (props.history.push(props.match.url))   

  const addToCart = () => {
    addItem(product)
    setButtonDisplay({
      ...buttonDisplay,
      itemInCart: true
      
    })
    setCartQuantity(itemTotal())
    setRefreshCart(!refreshCart)
  }

  const shouldRedirect = command => {
    if(command){
      return <Redirect to={props.match.path} />
    }
  }

  const handleChange = (productId) => event => {
    setCount(event.target.value < 1 ? 1 :event.target.value)
    if(event.target.value >= 1){
      updateItem(productId, event.target.value)
    }
    setRefreshCart(!refreshCart) // allows <Checkout /> total to updatde
  }

  /* ========== BUTTONS & BUTTON CONFIGURATION =================== */
  /* 1. BUTTON - VIEW PRODUCT */
  const viewProductButton = (showButton) => {
    const path = isAuthenticated() ? `/product/${product._id}` : '/signin'
    const leftMargin = buttonDisplay.itemInCart || !showAddToCartButton ? '' : 'ml-2'
    return(showButton &&
    <Link to={path}>
      <button      
      className={`btn btn-outline-primary mt-2 mb-2 mr-2 ${leftMargin}`}>
        View Product
      </button>
    </Link>)
  }
  /* 2. BUTTON - ADD TO CART  */
  const addToCartButton = (showButton) => (
    showButton && product.quantity > 0 && <button 
    onClick={addToCart} 
    className="btn btn-outline-warning mt-2 mb-2">
        Add to Cart
    </button>
  )
    
  /* 3. BUTTON - REMOVE */
  const removeProductButton = (showButton, refreshPage=true) => (
    showButton && <button 
    onClick={()=>{
      removeItem(product._id)      
      setButtonDisplay({
        ...buttonDisplay,
        itemInCart: onCartPage
      })
      setCartQuantity(itemTotal())
      setRefreshCart(!refreshCart)
    }} 
    className='btn btn-outline-danger mt-2 mb-2'>Remove Item</button>
  )
  /* 4. INPUT QUANTITY */
  const changeQuantityButtons = (showButtons) => {
    return showButtons &&
     <div className='input-group mb-2 mt-2'>
       <div className="input-group-prepend">
         <span className="input-group-text">Adjust Quantity</span>
       </div>
       <input type="number" value={count ? count : 1} max={product.quantity} min={1} className="form-control" onChange={handleChange(product._id)}/>
     </div>
  }
  /* 5. BADGE - QTY IN STOCK */
  const showStockBadge = (quantity) => {
    return (quantity > 0 ? <span className='badge badge-primary badge-pill' >{`${quantity} In Stock`}</span> 
      : 
      <span className='badge badge-primary badge-pill' >Out of Stock</span>)
  }

  
  /* BUTTON CONFIGURATION FOR PRODUCTS -- renderes two different sets based on user role */
  const actionButtons = () => {
    if(buttonDisplay.itemInCart){
      return (
        <div>
          {showStockBadge(product.quantity)}
          <br/>
          {onCartPage ? '' : 
          <h4 className='mt-2'>
            This item is in your cart <i style={{color: '#00DD55'}} className="fas fa-check"></i>
          </h4>}
          {viewProductButton(buttonDisplay.showViewProductButton)}
          {removeProductButton(buttonDisplay.showRemoveProductButton)}
          {changeQuantityButtons(buttonDisplay.showChangeQuantityButtons)}
          
        </div>
      )
    } else{
      return(
      <div>
        {showStockBadge(product.quantity)}
        <br/>
        {addToCartButton(buttonDisplay.showAddToCartButton)}
        {viewProductButton(buttonDisplay.showViewProductButton)}        
        {buttonDisplay.showAdminControls && <AdminControls product={product} />}
      </div>
      )
    }
  }

  const card_header_style = buttonDisplay.itemInCart ? 'in_cart_item' : 'name'

  return (
    
      <div className="card" style={{minHeight: '600px'}}>
        <div className={`card-header ${card_header_style}`}>
          {product.name} {buttonDisplay.itemInCart ? <i className="fas fa-check"></i> : ''}
        </div>
        <div className="card-body">
        {shouldRedirect(redirect)}        
        <Image item={product} url='product' />
        <p className='lead mt-2'>{product.description.substring(0, 100)}...</p>
        <p className='black-10'>₹ {product.price}</p>
        <p className="black-9">Category: {product.category && product.category.name}</p>
        <p className="black-8">Added {moment(product.createdAt).fromNow()}</p>
        {actionButtons()}               
        </div>
      </div>
    
  )
}

export default Card
