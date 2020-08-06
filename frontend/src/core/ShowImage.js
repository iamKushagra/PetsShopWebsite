import React from 'react'
import {API} from '../config'


const ShowImage = ({item, url}) => {
  console.log('ShowImage item: ', item, 'url: ', url)
  const productId = item._id ? item._id : item
  

  return (
    <div className='product-img' style={{textAlign: 'center'}}>
      <img 
      src={`${API}/${url}/photo/${productId}`} 
      alt={item.name} 
      className="mb-3" 
      style={{maxHeight: '100%', maxWidth: '100%'}}/>
    </div>
  )
}

export default ShowImage
