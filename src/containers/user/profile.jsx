import { useDispatch, useSelector } from 'react-redux'
import {selectUser, setUser} from "../../slices/userSlice"
import {Link} from "react-router-dom"
import {config} from "../../config"
import { getAllActivitiesByAuthor } from "../../api/activity"
import { useEffect, useState} from 'react'

const Profile = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [activities, setActivities] = useState([])

  useEffect(()=> {
    getAllActivitiesByAuthor(user.data.id)
    .then((res)=>{
      if (res.status === 200){
        setActivities(res.activities)
      }
    })
    .catch((err)=>{
      console.log("err from getAllActivitiesByAuthor -->", err)
    })
  }, [user])

  return (
    <>
      <h1>Bienvenue {user.data.firstName}</h1>
      <section className='profile-user-data'>
        <h2>Mes informations personnelles</h2>
        { user.data.avatar !== null ? <img src={user.data.avatar} className="profile-avatar"/> : <img src={`${config.pict_url}/user.png`} className="profile-avatar"/> }
        <p>Mes points: {user.data.points}</p>
        <p>Mes numéro de téléphone: {user.data.phone}</p>
        <Link>Modifier mes informations</Link>
      </section>
      <section className='profile-user-activities'>
        <h2>Mes activités (en ligne / hors ligne / en attente de validation)</h2>
        { activities.length > 0 ? <ul>
          { activities.map(activity => {
            return (<li key={activity.id}>{activity.title}</li>)
          })}
        </ul> : <p>Vous n'avez pas encore créé d'activités.</p>}

      </section>
      <section className='profile-user-comments'>
        <h2>Mes commentaires (en ligne / en attente de validation)</h2>
      </section>
    </>
  )
}

export default Profile;
