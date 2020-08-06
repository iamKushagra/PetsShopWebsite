import React, {useState} from 'react'
import {Redirect} from 'react-router-dom'
import {deleteProduct} from '../core/apiCore'
import {isAuthenticated} from '../auth/index'


const DeleteUpdateProduct = ({product}) => {
  const productId = product._id
  const userId = isAuthenticated().user._id
  const [sendHome, setSendHome] = useState(false)
  const [sendToEdit, setSendToEdit] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(false)
  

  const redirectHome = () => {
    if(sendHome){
      return <Redirect to='/' />
    }
  }

  const redirectEditing = () => {
    if(sendToEdit){
      return <Redirect to={`/editing/${productId}`}/>
    }
  }

  const deleteSuccessMessage = () => (
    <div className='alert alert-success' style={{display: deleteSuccess ? '' : 'none', margin: '0 auto'}}><h2>{`${product.name} was sucessfully deleted!`}</h2></div>
  )

  const executeDelete = () => {
    deleteProduct(productId, userId)
    .then((response) =>{
      //console.log('REDIRECT RESPONSE: ', response)
      setDeleteSuccess(true)
      setTimeout(function(){setSendHome(true)}, 2000)
    })
  }
  
  /* DELETE PRODUCT BUTTON */
  const deleteButton = () => {
    return (!deleteSuccess && <button
            className="btn btn-danger mt-2 mb-2 mr-2"
            onClick={executeDelete}
          >
          DELETE THIS PRODUCT
          </button>)
  }
  /* EDIT PRODUCT BUTTON */
  const editButton = () => {
    return (
      <button 
      className="btn btn-warning mt-2 mb-2 mr-1"
      onClick={()=> setSendToEdit(true)}
      >EDIT</button>)
  }


  return (
    <div>
      <h3>Admin Controls</h3>
      {redirectHome()}
      {redirectEditing()}
      {deleteSuccessMessage()}
      {deleteButton()}
      {editButton()}
      
    </div>
  )
}

export default DeleteUpdateProduct
