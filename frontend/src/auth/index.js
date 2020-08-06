import axiosWithAuth from '../utils/axiosWithAuth'


export const signup = (user) => {
  return axiosWithAuth()
  .post('/signup', user)
  .then(response=>{
    console.log('singup response: ',response)
    return response.data
  })
  .catch(error=>{
    console.log("here's error: ",error.response)
    return error.response.data
  })
}

export const signin = (user) => {
  return axiosWithAuth()
  .post('/signin', user)
  .then(response=>{
    console.log('singup response: ',response)
    return response.data
  })
  .catch(error=>{
    console.log("here's error: ",error.response)
    return error.response.data
  })
}


export const authenticate = (data, next)=>{
  if(typeof window !== 'undefined'){
    localStorage.setItem('jwt', JSON.stringify(data))
    next()
  }
}

export const signout = (next) => {
  if(typeof window !== 'undefined'){
    localStorage.removeItem('jwt')
    next()
    axiosWithAuth()
    .get('/signout')
    .then(res=>{
      console.log(res)
    })
    .catch(err=>{console.log(err)})
  }
}

export const isAuthenticated = () => {
  if(typeof window == 'undefined'){
    return false
  }

  if(localStorage.getItem('jwt')){
    return JSON.parse(localStorage.getItem('jwt'))
  } else{
    return false
  }
}