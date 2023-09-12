import { Link } from "react-router-dom"

import { useState, useEffect } from "react";
import {getAllWaitingComments} from "../../api/comment"
import { getAllWaitingActivities } from "../../api/activity"
import { getAllCategories, updateOneCategory, deleteOneCategory} from "../../api/category"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye } from "@fortawesome/free-regular-svg-icons"
import { faArrowRightFromBracket, faSquareCheck, faScrewdriverWrench, faTrashCan } from "@fortawesome/free-solid-svg-icons";

import moment from "moment"

const Admin = () => {
  const [activities, setActivites] = useState([])
  const [comments, setComments] = useState([])
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState("")
  const [error, setError] = useState(null)

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

    getAllCategories()
    .then((res)=>{
      if (res.status === 200){
        setCategories(res.categories)
      }
    })
    .catch(err => console.log(err))
  }, [])

  const handleSubmit = (e, id) => {
    e.preventDefault();
    setError(null)
    let data = {title: category}
    updateOneCategory(data, id)
    .then((res) => {
      if (res.status === 200){
        getAllCategories()
        .then((response)=>{
          if (response.status === 200){
            setCategories(response.categories)
          }
        })
        .catch(error => console.log(error))
      } else {
        setError(res.msg)
      }
    })
    .catch(err => console.log(err))
  }

  const deleteCategory = (id) => {
    console.log(id)
    deleteOneCategory(id)
    .then((res) => {
      if (res.status === 200){
        getAllCategories()
        .then((response)=>{
          if (response.status === 200){
            setCategories(response.categories)
          }
        })
        .catch(error => console.log(error))
      } else {
        setError(res.msg)
      }
    })
  }

  return (
    <section className="admin">
      <h1>Tableau de bord adminisrateur</h1>
      <Link to ="/logout"><FontAwesomeIcon icon={faArrowRightFromBracket}/> Déconnexion</Link>

      { activities.length !== 0 ?
        <article className="admin-activities">
          <h2>Activités en attente de validation</h2>
          <table>
            <thead>
              <tr>
                <td>
                  Activité
                </td>
                <td>
                  Modifiée le
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
                    <td>{moment(activity.updatingTimestamps).locale("fr").format("DD/MM/YYYY")}</td>
                    <td>
                      <Link to={`/activity/moderate/${activity.id}`}><FontAwesomeIcon icon={faEye}/></Link>
                    </td>

                  </tr>
                )
              })}
            </tbody>
          </table>
        </article>
      :
        <article className="admin-comments">
          <h2>Activités en attente de validation</h2>
          <p>Il n'y a pas d'activités en attente de validation</p>
        </article>
      }

      { comments.length !== 0 ?
        <article>
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
        </article>
      :
        <article>
          <h2> Commentaires en attente de validation</h2>
          <p>Il n'y a pas de commentaires en attente de validation</p>
        </article>
      }


      <article>
        <h2>Gestion des catégories</h2>
        <p>Créer une nouvelle catégorie</p>
        { error !== null && <p>{error}</p>}
        { categories.length !== 0 ?
          <table className="manage-categories">
            <tbody>
              { categories.map((category)=>{
                return (
                  <tr key={category.id}>
                    <td>
                      {category.title}
                    </td>
                    <td>
                      <form onSubmit={(e) => {handleSubmit(e, category.id )}}>
                        <input type="text" defaultValue={category.title} onChange={(e)=>{setCategory(e.currentTarget.value)}}/>
                        <FontAwesomeIcon icon={faSquareCheck} onClick={(e) => {handleSubmit(e, category.id )}}/>
                      </form>
                    </td>
                    <td><FontAwesomeIcon icon={faTrashCan} onClick={(e) => {deleteCategory(category.id)}}/></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          :
          <p>Aucune catégorie trouvée, veuillez recharger la page.</p>
        }
      </article>





    </section>
  )
}

export default Admin;
