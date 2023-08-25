import { useDispatch, useSelector } from 'react-redux'
import {selectUser} from "../../slices/userSlice"
import {Link} from "react-router-dom"
import {config} from "../../config"
import { getAllActivitiesByAuthor } from "../../api/activity"
import { getAllCommentsByAuthorId } from '../../api/comment'
import { useEffect, useState} from 'react'

const Profile = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [activities, setActivities] = useState([])
  const [ comments, setComments] = useState([])


  function tabsCommentsAnimation(e){
    const tabsComments = [...document.querySelectorAll(".tab-comments")]
    const tabsCommentsContents = [...document.querySelectorAll(".tab-comments-content")]

    const indexToRemove = tabsComments.findIndex(tab => tab.classList.contains("active-tab-comments"));
    tabsComments[indexToRemove].classList.remove("active-tab-comments");

    const indexToShow = tabsComments.indexOf(e.target)
    tabsComments[indexToShow].classList.add("active-tab-comments");

    tabsCommentsContents[indexToRemove].classList.remove("active-tab-comments-content");
    tabsCommentsContents[indexToShow].classList.add("active-tab-comments-content");
  }

  function tabsActivitiesAnimation(e){
    const tabsActivities = [...document.querySelectorAll(".tab-activities")]
    const tabsActivitiesContents = [...document.querySelectorAll(".tab-activities-content")]

    const indexToRemove = tabsActivities.findIndex(tab => tab.classList.contains("active-tab-activities"));
    tabsActivities[indexToRemove].classList.remove("active-tab-activities");

    const indexToShow = tabsActivities.indexOf(e.target)
    tabsActivities[indexToShow].classList.add("active-tab-activities");

    tabsActivitiesContents[indexToRemove].classList.remove("active-tab-activities-content");
    tabsActivitiesContents[indexToShow].classList.add("active-tab-activities-content");
  }

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

    getAllCommentsByAuthorId(user.data.id)
    .then((res)=>{
      if (res.status === 200){
        setComments(res.comments)
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
        <h2>Mes activités</h2>
        { activities.length > 0 ?
          <div className="tabs">
              <div className="tabs-activities">
                  <button className="tab-activities active-tab-activities" onClick={(e)=>{tabsActivitiesAnimation(e)}}>En ligne</button>
                  <button className="tab-activities" onClick={(e)=>{tabsActivitiesAnimation(e)}}>Hors ligne</button>
                  <button className="tab-activities" onClick={(e)=>{tabsActivitiesAnimation(e)}}>En attente de validation</button>
              </div>
              <div className="tab-activities-content active-tab-activities-content">
              { activities.some(activity => activity.status === "en ligne") ? (
                <ul>
                  { activities.map(activity => {
                    if (activity.status === "en ligne"){
                      return (<li key={activity.id}>{activity.title}</li>)
                    }
                    return null
                    })
                  }
                </ul>) : <p>Vous n'avez pas d'activités en ligne.</p>}
              </div>
              <div className="tab-activities-content">
              { activities.some(activity => activity.status === "hors ligne") ? (
              <ul>
                  { activities.map(activity => {
                    if (activity.status === "hors ligne"){
                      return (<li key={activity.id}>{activity.title}</li>)
                    }
                    return null
                    })
                  }
                </ul>) : <p>Vous n'avez pas d'activités hors ligne.</p>}
              </div>
              <div className="tab-activities-content">
              { activities.some(activity => activity.status === "en attente de validation") ? (
              <ul>
                  { activities.map(activity => {
                    if (activity.status === "en attente de validation"){
                      return (<li key={activity.id}>{activity.title}</li>)
                    }
                    return null
                    })
                  }
                </ul>) : <p>Vous n'avez pas d'activités en attente de validation.</p>}
              </div>
          </div>


         : <p>Vous n'avez pas encore créé d'activités.</p>}
      </section>

      <section className='profile-user-comments'>
        <h2>Mes commentaires</h2>
        { comments.length > 0 ?
          <div className="tabs">
              <div className="tabs-comments">
                  <button className="tab-comments active-tab-comments" onClick={(e)=>{tabsCommentsAnimation(e)}}>Validés</button>
                  <button className="tab-comments" onClick={(e)=>{tabsCommentsAnimation(e)}}>En attente de validation</button>
              </div>
              <div className="tab-comments-content active-tab-comments-content">
              { comments.some(comment => comment.status === "validé") ? (
                <ul>
                  { comments.map(comment => {
                    if (comment.status === "validé"){
                      return (<li key={comment.id}>{comment.title}</li>)
                    }
                    return null
                    })
                  }
                </ul>) : <p>Vous n'avez pas de commentaires validés.</p>}
              </div>
              <div className="tab-comments-content">
              { comments.some(comment => comment.status === "en attente de validation") ? (
              <ul>
                  { comments.map(comment => {
                    if (comment.status === "en attente de validation"){
                      return (<li key={comment.id}>{comment.title}</li>)
                    }
                    return null
                    })
                  }
                </ul>) : <p>Vous n'avez pas de commentaires en attente de validation.</p>}
              </div>
          </div>
        : <div className="no-comments">
          <p>Vous n'avez pas encore écrit de commentaires.</p>
        </div>}
      </section>
    </>
  )
}

export default Profile;
