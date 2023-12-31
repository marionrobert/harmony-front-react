import './App.scss'

import Header from "./components/header"
import Footer from "./components/footer"

import Home from './containers/home'
import Basket from './containers/basket'

// activities
import Activities from './containers/activities'
import Details from "./containers/activity/details"
import AddActivity from './containers/activity/addActivity'
import EditActivity from './containers/activity/editActivity'

import Booking from './containers/booking'

// user
import Login from "./containers/user/login"
import Forgot from "./containers/user/forgot"
import Register from "./containers/user/register"
import Logout from "./containers/user/logout"
import Profile from "./containers/user/profile"
import EditUser from './containers/user/edit'

// admin
import Admin from './containers/admin/dashboard'
import ModerateActivity from './containers/admin/moderateActivity'
import ModerateComment from './containers/admin/moderateComment'

import {Routes, Route} from 'react-router-dom'
import RequireDataAuth from './helpers/require-data-auth'
import {Navigate} from 'react-router-dom'

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route exact path="/" element={<RequireDataAuth child={Home} auth={false} admin={false} />} />
          <Route exact path="/basket" element={<RequireDataAuth child={Basket} auth={true} admin={false} />} />

          {/* ACTIVITIES, DETAILS, ADD ACTIVITY, UPDATE ACTIVITY, DELETE ACTIVITY */}
          <Route exact path="/activities" element={<RequireDataAuth child={Activities} auth={true} admin={false} />} />
          <Route exact path="/activity/create" element={<RequireDataAuth child={AddActivity} auth={true} admin={false} />} />
          <Route exact path="/activity/update/:id" element={<RequireDataAuth child={EditActivity} auth={true} admin={false} />} />
          <Route exact path="/activity/details/:id" element={<RequireDataAuth child={Details} auth={true} admin={false} />} />

          {/* BOOKING */}
          <Route exact path="/booking/:id" element={<RequireDataAuth child={Booking} auth={true} admin={false} />} />

          {/* LOGIN, LOGOUT, REGISTER, FORGOT, PROFILE, ADMIN */}
          <Route exact path="/register" element={<Register/>}/>
          <Route exact path="/login" element={<Login/>} />
          <Route exact path="/logout" element={<RequireDataAuth child={Logout} auth={true} admin={false} />} />
          <Route exact path="/forgot" element={<Forgot/>}/>
          <Route exact path="/profile" element={<RequireDataAuth child={Profile} auth={true} admin={false}/>}/>
          <Route exact path="/profile/edit" element={<RequireDataAuth child={EditUser} auth={true} admin={false}/>}/>


          {/* ADMIN: DASHBOARD, MODERATE ACTIVITY, MODERATE COMMENT */}
          <Route exact path="/admin" element={<RequireDataAuth child={Admin} auth={true} admin={true}/>}/>
          <Route exact path="/activity/moderate/:id" element={<RequireDataAuth child={ModerateActivity} auth={true} admin={true}/>}/>
          <Route exact path="/comment/moderate/:id" element={<RequireDataAuth child={ModerateComment} auth={true} admin={true}/>}/>

          <Route exact path="/home" element={<Navigate to="/"/>} />
          <Route path="*" element={<Navigate to="/home"/>} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
