import './App.scss'

import Header from "./components/header"
import Footer from "./components/footer"
import Home from './containers/home'

// activities
import Activities from './containers/activities'
import Details from "./containers/details"
import AddActivity from './containers/activity/addActivity'
import EditActivity from './containers/activity/editActivity'

// user
import Login from "./containers/user/login"
import Forgot from "./containers/user/forgot"
import Register from "./containers/user/register"
import Logout from "./containers/user/logout"
import Profile from "./containers/user/profile"
import Admin from './containers/user/admin'

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

          {/* ACTIVITIES, DETAILS, ADD ACTIVITY, UPDATE ACTIVITY, DELETE ACTIVITY */}
          <Route exact path="/activities" element={<RequireDataAuth child={Activities} auth={true} admin={false} />} />
          <Route exact path="/activity/create" element={<RequireDataAuth child={AddActivity} auth={true} admin={false} />} />
          <Route exact path="/activity/update/:id" element={<RequireDataAuth child={EditActivity} auth={true} admin={false} />} />
          <Route exact path="/activity/details/:id" element={<RequireDataAuth child={Details} auth={true} admin={false} />} />

          {/* LOGIN, LOGOUT, REGISTER, FORGOT, PROFILE, ADMIN */}
          <Route exact path="/register" element={<Register/>}/>
          <Route exact path="/login" element={<Login/>}/>
          <Route exact path="/logout" element={<RequireDataAuth child={Logout} auth={true} admin={false} />} />
          <Route exact path="/forgot" element={<Forgot/>}/>
          <Route path="/profile" element={<RequireDataAuth child={Profile} auth={true} admin={false}/>}/>

          {/* ADMIN: DASHBOARD, MODERATE ACTIVITY, MODERATE COMMENT */}
          <Route path="/admin" element={<RequireDataAuth child={Admin} auth={true} admin={true}/>}/>

          <Route exact path="/home" element={<Navigate to="/"/>} />
          <Route exact path="*" element={<Navigate to="/"/>} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
