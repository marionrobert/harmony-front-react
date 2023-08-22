import './App.scss'

import Header from "./components/header"
import Footer from "./components/footer"
import Home from './containers/home'

// user
import Login from "./containers/user/login"
import Forgot from "./containers/user/forgot"
import Register from "./containers/user/register"

import {Routes, Route} from 'react-router-dom'
// import RequireAuth from './helpers/require-auth'
// import {Navigate} from 'react-router-dom'

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/forgot" element={<Forgot/>}/>
          <Route path="/register" element={<Register/>}/>
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
