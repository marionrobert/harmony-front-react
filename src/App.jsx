import './App.scss'

import Header from "./components/Header"
import Footer from "./components/Footer"

import Home from './containers/Home'
import Basket from './containers/Basket'

// activities
import Activities from './containers/Activity/AllActivities'
import Details from "./containers/Activity/Details"
import AddActivity from './containers/Activity/AddActivity'
import EditActivity from './containers/Activity/EditActivity'

import Booking from './containers/Booking'

// user
import Login from "./containers/User/Login"
import Forgot from "./containers/User/Forgot"
import Register from "./containers/User/Register"
import Logout from "./containers/User/Logout"
import Profile from "./containers/User/Profile"
import EditUser from './containers/User/Edit'

// admin
import Admin from './containers/Admin/dashboard'
import ModerateActivity from './containers/Admin/moderateActivity'
import ModerateComment from './containers/Admin/moderateComment'

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
