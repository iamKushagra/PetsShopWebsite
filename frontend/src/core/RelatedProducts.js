import React, {useState, useEffect} from 'react'
import Card from './Card'
import {listRelated} from './apiCore'
import {checkForItemInCart} from './cartHelpers'
const RelatedProducts = ({props, productId, setCartQuantity}) => {
  const [relatedProducts, setRelatedProducts] = useState([]) 

  useEffect(()=>{
    listRelated(productId)
    .then(data=>{
      if(data.error){
        console.log('Product.js loadProduct, listRelated data.error: ', data.error)
        
      } else{
        //console.log('Product.js loadProduct, listRelated data:', data)
        setRelatedProducts(data)
      }
  })
  }, [productId])

  const heading = () => {
    return (
      relatedProducts.length ? <h4 className='mb-4'>Check out these related products: </h4> :
      <div>
        <h4 className='mb-4'>Check out these related products: </h4>
        <p>There currently aren't any products realted to this product.</p>
      </div>
    )
  }
  
  return (
    <div>
      {heading()}
      {relatedProducts.length > 0 && relatedProducts.map((product, i)=>(
        <div key={i}  className='mb-3'>
          
          <Card 
          props={props} 
          product={product}
          itemInCart={checkForItemInCart(product._id)}
          showAddToCartButton={product.quantity > 0}
          showChangeQuantityButtons={product.quantity > 0}
          setCartQuantity={setCartQuantity}
          />
        </div>
        ))}        
    </div>
  )
}

export default RelatedProducts
