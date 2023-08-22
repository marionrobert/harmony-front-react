import './App.scss'

import Header from "./components/header"
import Footer from "./components/footer"
import Home from './containers/home'

// user
import Login from "./containers/user/login"
import Forgot from "./containers/user/forgot"
import Register from "./containers/user/register"
import Logout from "./containers/user/logout"

import {Routes, Route} from 'react-router-dom'
import RequireDataAuth from './helpers/require-data-auth'
import {Navigate} from 'react-router-dom'

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route exact path="/" element={<Home />} />

          {/* LOGIN, LOGOUT, REGISTER, FORGOT, PROFILE */}
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route exact path="/logout" element={<RequireDataAuth child={Logout} auth={true} admin={false} />} />
          <Route path="/forgot" element={<Forgot/>}/>

          <Route exact path="*" element={<Navigate to="/"/>} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
