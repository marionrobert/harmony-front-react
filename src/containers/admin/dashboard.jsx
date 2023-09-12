import { Link } from "react-router-dom"

import { useState, useEffect } from "react";
import {getAllWaitingComments} from "../../api/comment"
import { getAllWaitingActivities } from "../../api/activity"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye } from "@fortawesome/free-regular-svg-icons"
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

import moment from "moment"

const Admin = () => {
  const [activities, setActivites] = useState([])
  const [comments, setComments] = useState([])

  useEffect(() => {
    getAllWaitingActivities()
    .then((res)=>{
      // console.log(res)
      if (res.status === 200){
        setActivites(res.activities)
      }
    })
    .catch(err => console.log(err))

    getAllWaitingComments()
    .then((res)=>{
      // console.log(res)
      if (res.status === 200){
        setComments(res.comments)
      }
    })
    .catch(err => console.log(err))
  }, [])

  return (
    < section className="admin">
      <h1>Tableau de bord adminisrateur</h1>
      <Link to ="/logout"><FontAwesomeIcon icon={faArrowRightFromBracket}/> Déconnexion</Link>

      { activities.length !== 0 ?
        <section className="admin-activities">
          <h2>Activités en attente de validation</h2>
          <table>
            <thead>
              <tr>
                <td>
                  Activité
                </td>
                <td>
                  Créée le
                </td>
                <td>
                  Voir
                </td>
              </tr>
            </thead>
            <tbody>
              { activities.map((activity)=>{
                return (
                  <tr key={activity.id}>
                    <td>
                      {activity.title}
                    </td>
                    <td>{moment(activity.creationTimestamp).locale("fr").format("DD/MM/YYYY")}</td>
                    <td>
                      <Link to={`/activity/moderate/${activity.id}`}><FontAwesomeIcon icon={faEye}/></Link>
                    </td>

                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
      :
        <section className="admin-comments">
          <h2>Activités en attente de validation</h2>
          <p>Il n'y a pas d'activités en attente de validation</p>
        </section>
      }

      { comments.length !== 0 ?
        <section>
          <h2>Commentaires en attente de validation</h2>
          <table>
            <thead>
              <tr>
                <td>
                  Titre
                </td>
                <td>
                  Posté le
                </td>
                <td>
                  Voir
                </td>
              </tr>
            </thead>
            <tbody>
              { comments.map((comment)=>{
                return (
                  <tr key={comment.id}>
                    <td>
                      {comment.title}
                    </td>
                    <td>{moment(comment.creationTimestamp).locale("fr").format("DD/MM/YYYY")}</td>
                    <td>
                      <Link to={`/comment/moderate/${comment.id}`}><FontAwesomeIcon icon={faEye}/></Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
      :
        <section>
          <h2> Commentaires en attente de validation</h2>
          <p>Il n'y a pas de commentaires en attente de validation</p>
        </section>
      }
    </section>
  )
}

export default Admin;
