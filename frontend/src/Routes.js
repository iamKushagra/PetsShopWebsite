import React from 'react'
import {Switch, Route, useLocation}  from 'react-router-dom'
import {animated, useTransition, config} from 'react-spring'
import SignUp from './user/SignUp'
import SignIn from './user/SignIn'
import Home from './core/Home'
import PrivateRoute from './auth/PrivateRoute'
import Dashboard from './user/UserDashboard'
import AdminRoute from './auth/AdminRoute'
import AdminDashboard from './user/AdminDashboard'
import AddCategory from './admin/AddCategory'
import AddProduct from './admin/AddProduct'
import UpdateProduct from './admin/UpdateProduct'
import Shop from './core/Shop'
import Product from './core/Product'
import Cart from './core/Cart'
import Orders from './admin/Orders'
import './styles/css/Layout.css'


const Routes = () => {

  const location = useLocation()
  /* console.log('LOCATION: ')
  console.log(location) */
  const transistions = useTransition(location, location => location.pathname, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 1 },
    config: {duration: 700, friction: 100}
  })


  return transistions.map(({item: location, props, key})=>(
    <animated.div key={key} style={props} className='main-container'>
        <Switch location={location}>
          <Route path='/' exact component={Home} />        
          <Route path='/signin' exact component={SignIn} />
          <Route path='/signup' exact component={SignUp} />
          <Route path='/shop' exact component={Shop} />     
          <PrivateRoute path='/user/dashboard' exact compenent={Dashboard} />
          <PrivateRoute path='/cart' exact compenent={Cart} />
          <AdminRoute path='/admin/dashboard' exact compenent={AdminDashboard} />
          <AdminRoute path='/create/category' exact compenent={AddCategory} />
          <AdminRoute path='/create/product' exact compenent={AddProduct} />
          <AdminRoute path='/editing/:productId' exact compenent={UpdateProduct} />
          <AdminRoute path='/admin/orders' exact compenent={Orders} />
          <Route path='/product/:productId' exact component={Product} />  
        </Switch>
    </animated.div>
    ))
}

export default Routes

