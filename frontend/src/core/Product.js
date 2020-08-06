import React, {useState, useEffect} from 'react'
import Layout from './Layout'
import Card from './Card'
import {isAuthenticated} from '../auth/index'
import RelatedProducts from './RelatedProducts'
import {read, getCategory} from '../core/apiCore.js'
import {checkForItemInCart, itemTotal} from './cartHelpers'

const Product = (props) => {
  const [product, setProduct] = useState({})   
  const [refreshCart, setRefreshCart] = useState(false)
  const [error, setError] = useState(false)
  const [cartQuantity,setCartQuantity] = useState(0)
  //console.log('PRODUCT PROPS: ', props)
  const loadProduct = productId => {
    console.log('!!!!!!!!!!!!!!LOAD PRODUCT!!!!!!!!!!!!!!')
    read(productId).then(data => {
      console.log("DATA: ",data)
        if (data.error) {
          setError(data.error);
        } else {            
          setProduct(data);
        }
    })
  };

  
  useEffect(()=>{
    const productId = props.match.params.productId
    loadProduct(productId)
    setCartQuantity(itemTotal())
  }, [props, refreshCart])

  //{product.category && loadCategory(product.category)}
  return (
    <Layout
      title={product && product.name}
      description={product && product.description && product.description.substring(0,100)}
      className='container-fluid'
      cartQuantity={cartQuantity}
    >
      <div className="row">
        <div className="col-xl-8 mt-5">
        {product && product.category && 
        <Card 
        props={props}
        showAdminControls={isAuthenticated().user.role === 1}
        itemInCart={checkForItemInCart(product._id)}
        product={product} 
        showViewProductButton={false}
        showAddToCartButton={product.quantity > 0}
        showChangeQuantityButtons={product.quantity > 0}        
        refreshCart={refreshCart}
        setRefreshCart={setRefreshCart}
        setCartQuantity={setCartQuantity}
        />}
        </div>
        <div className="col-xl-4">        
        <RelatedProducts 
        props={props} 
        productId={product._id} 
        setCartQuantity={setCartQuantity}
        />        
        </div> 
      </div>
    </Layout>
  )
}

export default Product
