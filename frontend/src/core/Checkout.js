/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react'
import {Link, Redirect} from 'react-router-dom'
import {emptyCart, checkForItemInCart} from './cartHelpers'
import {isAuthenticated} from '../auth'
import {getBraintreeClientToken, processPayment, createOrder} from './apiCore'
import DropIn from 'braintree-web-drop-in-react'

const Checkout = ({
  products, 
  setRefreshCart,
  refreshCart}) => {

  const [redirect, setRedirect] = useState(false)
  const [paymentData, setPaymentData] = useState({
    success: false,
    clientToken: null,
    error: '',
    instance: {},
    address: ''
  })
  const {address} = paymentData
  const userId = isAuthenticated() && isAuthenticated().user._id
  //console.log('PAYMENTDATA.CLIENTTOKEN: ', paymentData.clientToken)
  const getTotal = () => {
    return products.reduce((currentValue, nextValue)=>{
      return currentValue + nextValue.count * nextValue.price
    },0)
  }

  const [total, setTotal] = useState(getTotal())
  
  useEffect(()=>{
    setTotal(getTotal())
  },[products])

  const getToken = (id) => {
    getBraintreeClientToken(id)
    .then(data=>{
      if(data.error){
        setPaymentData({...paymentData, error: data.error})
      } else{
        //console.log('Checkout.js getToken clientToken data: ', data)
        setPaymentData({...paymentData, clientToken: data.clientToken})
      }
    })
  }
  //console.log(data.clientToken)
  useEffect(()=>{
    getToken(userId)
  }, [])

  const showCheckout = () => {
    return (
    isAuthenticated() ? <div>{showDropIn()}</div>
        : <Link to='signin'>
          <button className='btn btn-primary'>Sign in to checkout</button>
          </Link>
    )
  }


  const buy = () => {
    // send the nonce (data.instance.requestPaymentMethod()) 
    // nonce is the payment method
    let nonce;
    let getNonce = paymentData.instance.requestPaymentMethod()
    .then(data=>{
      console.log('Checkout.js buy getNonce data', data)
      nonce = data.nonce
      // once we have the nonce (card type, card number etc) send nonce as 
      // 'paymentMethodNonce' to the backend with the amount to be charged
      //console.log('sending nonce and total to process payment ', nonce, getTotal(products))
      const paymentData = {
        paymentMethodNonce: nonce,
        amount: getTotal()
      }

      processPayment(userId, paymentData)
        .then(response=>{
          console.log('Checkout.js buy processPayment Response', response)
          if(response.data.message){
            setPaymentData({...paymentData, error: response.data.message})
            return
          } else{
            // send order info to our backend: 
            const createOrderData = {
              products: products, // props
              transaction_id: response.data.transaction.id, 
              amount: response.data.transaction.amount,
              address: address // local state
            }
            createOrder(userId, createOrderData)// from apiCore POST to backend.
            .then(response=>{
              // empty cart
              emptyCart(()=>{
                console.log('PAYMENT SUCCESS AND CART EMPTIED')
                setRefreshCart(!refreshCart)
              })
              setPaymentData({...paymentData, success: true})
            }) 
          }
        })
        .catch(error=>{
          console.log('dropin error: ', error)
          setPaymentData({...paymentData, error: error.message})
        })
      
    })
    .catch(error=>{
      console.log('dropin error: ', error)
      setPaymentData({...paymentData, error: error.message})
    })
  } // buy()

  const showDropIn = () => (
    <div onBlur={()=> setPaymentData({...paymentData, error: ''})}>
      {paymentData.clientToken !== null && products.length > 0 ? (
        <div>
          <div className="form-group">
            <label htmlFor="" className="text-muted">Delivery address:</label>
            <textarea 
            value={address} 
            placeholder="Type your delivery address here..." 
            onChange={handleAddress} cols="30" rows="10" 
            className="form-control"></textarea>
          </div>
          <DropIn 
          options={{
            authorization: paymentData.clientToken,
            paypal: {
              flow: "vault"
            }
          }} 
          onInstance={instance => {return paymentData.instance=instance} }
          />
          <button onClick={buy} className="btn btn-success btn-block">Pay</button>
        </div>
      ) : null}
    </div>
  ) // showDropIn()

  const showError = (error) => (
    <div className='alert alert-danger' style={{display: error ? "" : 'none'}}>
      
      {error === 'No payment method is available.' ? "You didn't choose a form of payment yet. Please select a form of payment below:" : error}
    </div>
    )

  const showSuccess = () => (
    <div className='alert alert-info' style={{display: paymentData.success ? "" : 'none'}}>
      Thanks! Your payment was successfull.
    </div>
    )

  const handleAddress = (e) => {
    e.preventDefault()
    setPaymentData({
      ...paymentData, address: e.target.value
    })
  }

  return (
    <div>
      <h2>Total: ₹ {total}</h2>
      {showSuccess()}
      {showError(paymentData.error)}
      {showCheckout()}
    </div>
  )
}

export default Checkout
