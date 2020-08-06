import axiosWIthAuth from '../utils/axiosWithAuth'
import {sortByName} from '../utils/sorterFunctions'
import queryString from 'query-string'
import {API} from '../config'

export const getProducts = (sortBy) => {
  return axiosWIthAuth()
  .get(`/products?sortBy=${sortBy}&order=desc&limit=6`)
  .then(response => {
    console.log('apiCore getProducts response: ',response.data)
    console.log(response)
    const products = response.data    
    return products
  })
  .catch(error =>{
    console.log("ERROR")
    console.log('apiCore getProducts error.response.data: ', error.response.data)
    return error.response.data
  })
}
export const getCategories = () => {
  return axiosWIthAuth()
  .get(`/category`)
  .then(response => {
    console.log('response',response.data.categories)
    const categories = response.data.categories 
    categories.sort(sortByName)
    return categories
  })
  .catch(error =>{
    console.log("ERROR")
    console.log('apiAdmin getCategories error.response.data: ', error.response.data)
    return error.response.data
  })
}

export const getFilteredProducts = (skip, limit, filters={}) => {
  const data = {
    limit,
    skip,
    filters
  }
  return axiosWIthAuth()
  .post(`/products/by/search`, data)
  .then(response => {
    console.log('response',response.data)
    return response.data
  })
  .catch(error =>{
    console.log("ERROR")
    console.log('apiCore getFilteredProducts error.response.data: ', error.response.data)
    return error.response.data
  })
}

export const list = (params) => {
  const query = queryString.stringify(params)
  console.log('apiCore list query', query)
  return axiosWIthAuth()
  .get(`/products/search?${query}`)
  .then(response => {
    console.log('apiCore list response: ',response.data)
    console.log(response)
    const products = response.data
    
    return products
  })
  .catch(error =>{
    console.log("ERROR")
    console.log('apiCore list error.response.data: ', error.response.data)
    return error.response.data
  })
}



export const getCategory = (categoryId) =>{
  console.log('apiCore getCategory categoryId: ', categoryId)
  return axiosWIthAuth()
  .get(`/category/${categoryId}`)
  .then(response=>{
    console.log('apiCore getCategory response: ', response)
    const category = response.data.category
    return category
  })
  .catch(error=>{
    console.log("ERROR")
    console.log('apiCore getCategory error.response: ', error.response)
    return error.response
  })
}

export const read = (productId) => {
  console.log('apiCore read productId: ', productId)
  return axiosWIthAuth()
  .get(`/product/${productId}`)
  .then(response => {
    console.log('apiCore read response: ',response)    
    let product = response.data.product
    return getCategory(product.category)
    .then(catData=>{
      console.log('CATEGORY DATA', catData)
      product = {...product, category: catData}
      
      return product
    })
    .catch(error=>{
      console.log('ERROR apiCore READ=>GETCATEGORY ', error)
      return error
    })
  })
  .catch(error =>{
    console.log("ERROR")
    console.log('apiCore read error.response.data: ', error.response)
    return error.response
  })
}

export const listRelated = (productId) => {
  return axiosWIthAuth()
  .get(`/products/related/${productId}`)
  .then(response=>{
    //console.log('apiCore listRelated response: ', response)
    return response.data
  })
  .catch(error=>{
    //console.log('ERROR, apiCore listRelated:', error.response)
    return error.response
  })
}

export const getBraintreeClientToken = (userId) => {
  return axiosWIthAuth()
  .get(`/braintree/getToken/${userId}`)
  .then(response=>{
    console.log('apiCore getBraintreeClientToken response: ', response)
    return response.data
  })
  .catch(error=>{
    console.log('ERROR, apiCore getBraintreeClientToken:', error.response)
    return error.response
  })
}

export const processPayment = (userId, paymentData) => {
  return axiosWIthAuth()
  .post(`/braintree/payment/${userId}`, paymentData)
  .then(response=>{
    console.log('apiCore processPayment response: ', response)
    return response
  })
  .catch(error=>{
    console.log('ERROR, apiCore processPayment:', error.response)
    return error
  })
}

export const deleteProduct = (productId, userId)=>{
  return axiosWIthAuth()
  .delete(`/product/${productId}/${userId}`)
  .then(response=>{
    console.log(response)
    return response
  })
  .catch(error=>{
    console.log(error.response)
    return error
  })
}

export const createOrder = (userId, createOrderdata) => {
  return axiosWIthAuth()
  .post(`/order/create/${userId}`, createOrderdata)
  .then(response=>{
    console.log('POST apiCore createOrder response: ', response)
    return response
  })
  .catch(error=>{
    console.log('ERROR, apiCore createOrder:', error.response)
    return error
  })
}