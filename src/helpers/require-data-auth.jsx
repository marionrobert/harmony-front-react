import {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'

import {selectUser, setUser} from '../slices/userSlice'
import {selectActivities, setOnlineActivities} from '../slices/activitySlice'
import {selectBasket, updateBasket, cleanBasket } from '../slices/basketSlice'

import {Navigate, useParams, useLocation} from 'react-router-dom'
import {checkMyToken} from '../api/user'
import {getAllOnlineActivities} from '../api/activity'

import { config } from "../config";
import axios from "axios";


// HOC de contrôle des datas et de la sécurité
const RequireAuth = (props) => {
  // récupération des params de la route
  const params = useParams()

  // récupération des states dans le store
  const activities = useSelector(selectActivities)

  //on prépare la fonctionnalité pour dispatcher notre action dans le store
  const dispatch = useDispatch()

  // récupération du composant à afficher (passé en tant que props dans App.jsx)
  const Child = props.child

  //gestion de la redirection
  const [redirectToLogin, setRedirectToLogin] = useState(false)
  const [redirectToHome, setRedirectToHome] = useState(false)


  useEffect(()=>{
    // récupération de toutes les activités en ligne
    if (activities.activities.length === 0){
      getAllOnlineActivities()
      .then((response)=> {
        if (response.status === 200){
          dispatch(setOnlineActivities(response.activities))
        }
      })
      .catch((error)=>{
        console.log("error de getAllOnlineActivities -->", error)
      })
    }

    if (props.auth) { // si la route est protégée
      // récupération du token dans le localStorage
      let token = window.localStorage.getItem("harmony-token")
      console.log("recup token from require auth-->", token)

      if (token === null) { // l'utilisateur n'est pas connecté
        setRedirectToLogin(true)
      } else { // l'utilisateur est connecté
        // vérification du format du token
        axios.get(`${config.api_url}/api/v1/checkToken`, {headers: {"x-access-token": token}})
        .then((res) => {
          if (res.data.status !== 200){ // format invalide
            // redirection + suppression token
            setRedirectToLogin(true)
            window.localStorage.removeItem("harmony-token")
          } else { // l'utilisateur est connecté
            if (props.admin === true && res.data.user.role !== "admin"){ // l'utilisateur connecté n'est pas admin
              setRedirectToHome(true)
            } else {
              // récupération des infos de l'utilisateur
              let currentUser = res.data.user
              console.log("currentUser -->", currentUser)

              // ajout du token à l'objet currentUser
              currentUser.token = token

              // mise à jour de la state user dans le store
              dispatch(setUser(currentUser))
            }
          }
        })
        .catch((err) => { console.log("err checkmytoken -->", err)})
      }
    }
  }, [props])

  if (redirectToHome){
    return <Navigate to="/"/>
  }

  if (redirectToLogin){
    return <Navigate to="/login"/>
  }

  //{...props} = transmet au composant enfant les props du parent (comme un relais)
  //params = j'ai crée une une props qui envoi le params de l'url (récupéré en haut par useParams) vers le composant enfant
  return <Child {...props} params={params} />;
}

export default RequireAuth
