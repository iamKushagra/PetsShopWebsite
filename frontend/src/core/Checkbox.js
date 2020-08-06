import React, {useState, useEffect} from 'react'

const Checkbox = ({categories, handleFilters}) => {
  //console.log('categories checkbox: ',categories)

  const [checked, setChecked] = useState([])

  const handleToggle = id => () => {
    // returns first index of or -1
    const currentCategoryId = checked.indexOf(id)    
    const newCheckedCategoryId = [...checked]
    // if currently checked was not already in checked state --> push 
    // else pull/take off
    if(currentCategoryId === -1){
      newCheckedCategoryId.push(id)
    } else{
      newCheckedCategoryId.splice(currentCategoryId, 1)
    }
    console.log('newCheckedCategoryId: ', newCheckedCategoryId)
    setChecked(newCheckedCategoryId)
    handleFilters(newCheckedCategoryId, 'category')
  }

  return (
    categories.map((c,i)=>(
      <li key={i} className='list-unstyled'>
        <input onChange={handleToggle(c._id)} value={checked.indexOf(c._id === -1)} type="checkbox" className="form-check-input"/>
        <label className='form-check-label'>{c.name}</label>
      </li>
    ))
  )
}

export default Checkbox
