import axiosWithAuth from '../utils/axiosWithAuth'
import {sortByName} from '../utils/sorterFunctions'
 
export const createCategory = (userId, category) => {
  return axiosWithAuth()
  .post(`/category/create/${userId}`, category)
  .then(responese => {
    console.log('POST apiAdmin createCategory response',responese.data)
    return responese.data
  })
  .catch(error =>{
    console.log('POST ERROR apiAdmin createCategory error.response.data: ', error.response.data)
    return error.response.data
  })
}

export const createProduct = (userId, product) => {
  return axiosWithAuth()
  .post(`/product/create/${userId}`, product)
  .then(responese => {
    console.log('POST apiAdmin createProduct response',responese.data)
    return responese.data
  })
  .catch(error =>{
    console.log('POST ERROR apiAdmin createProduct error.response.data: ', error.response.data)
    return error.response.data
  })
}

export const getCategories = () => {
  return axiosWithAuth()
  .get(`/category`)
  .then(responese => {
    console.log('GET apiAdmin getCategories response',responese.data.categories)
    const categories = responese.data.categories 
    categories.sort(sortByName)
    return categories
  })
  .catch(error =>{
    console.log('GET apiAdmin getCategories error.response.data: ', error.response.data)
    return error.response.data
  })
}

export const getProduct = (productId) => {
  return axiosWithAuth()
    .get(`/product/${productId}`)
    .then(response=>{
      const product = response.data.product
      console.log('GET apiAdmin getProduct response.data.product ', product)
      return product
      
    })
    .catch(error=>{
      console.log('GET ERROR apiAdmin getProduct error.response', error.response)
      return error.response.data
    })
}

export const updateProduct = (productId, userId, updated_product) => {
  return axiosWithAuth()
    .put(`/product/${productId}/${userId}`, updated_product)
    .then(response=>{
      const product = response.data.product
      console.log('PUT apiAdmin updateProduct /products/:productId/userId response.data.product ', product)
      return product
      
    })
    .catch(error=>{
      console.log('PUT ERROR apiAdmin updateProduct error.response', error.response)
      return error.response.data
    })
}

export const listOrders = (userId) => {
  return axiosWithAuth()
    .get(`/order/list/${userId}`)
    .then(response=>{
      const orders = response.data
      console.log('GET apiAdmin listOrder response.data ', response.data)
      return orders
      
    })
    .catch(error=>{
      console.log('GET ERROR apiAdmin listOrders error.response', error.response)
      return error.response.data
    })
}