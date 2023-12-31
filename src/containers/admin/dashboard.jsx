import { Link } from "react-router-dom"

import { useState, useEffect } from "react";
import {getAllWaitingComments} from "../../api/comment"
import { getAllWaitingActivities } from "../../api/activity"
import { getAllCategories, updateOneCategory, deleteOneCategory, saveOneCategory} from "../../api/category"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightFromBracket, faSquareCheck, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";

import moment from "moment"

const Admin = () => {
  const [activities, setActivites] = useState([])
  const [comments, setComments] = useState([])
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState("")
  const [error, setError] = useState(null)
  const [newCategory, setNewCategory] = useState("")
  const [errorCreateCategory, setErrorCreateCategory] = useState(null)

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
            displayOriginalFrame(id)
          }
        })
        .catch(error => console.log(error))
      } else {
        setError(res.msg)
      }
    })
    .catch(err => console.log(err))
  }

  const displayModifyZone = (id, title) => {
    let label = document.querySelector(`label.category_${id}`)
    let input = document.querySelector(`input.category_${id}`)
    let iconToHide = document.querySelector(`.fa-screwdriver-category_${id}`)
    let iconToDisplay = document.querySelector(`.fa-check-category_${id}`)
    label.style.display = "none"
    input.style.display = "inline-block"
    iconToHide.style.display = "none"
    iconToDisplay.style.display = "inline-block"
    setCategory(title)
  }

  const displayOriginalFrame = (id) => {
    let label = document.querySelector(`label.category_${id}`)
    let input = document.querySelector(`input.category_${id}`)
    let iconToHide = document.querySelector(`.fa-screwdriver-category_${id}`)
    let iconToDisplay = document.querySelector(`.fa-check-category_${id}`)
    label.style.display = "inline-block"
    input.style.display = "none"
    iconToHide.style.display = "inline-block"
    iconToDisplay.style.display = "none"
  }

  const deleteCategory = (id) => {
    deleteOneCategory(parseInt(id))
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

  const createCategory = (e) => {
    e.preventDefault()
    let form = e.currentTarget
    let data = {title: newCategory}
    saveOneCategory(data)
    .then((res) => {
      if (res.status === 200){
        form.reset()
        getAllCategories()
        .then((response)=>{
          if (response.status === 200){
            setCategories(response.categories)
          }
        })
        .catch(error => console.log(error))
      } else {
        setErrorCreateCategory(res.msg)
      }
    })
    .catch(err => console.log(err))

  }

  return (
    <section className="admin">
      <div className="logout-link">
        <Link to ="/logout"><FontAwesomeIcon icon={faArrowRightFromBracket}/> Déconnexion</Link>
      </div>
      <h1>Tableau de bord adminisrateur</h1>

      { activities.length !== 0 ?
        <article>
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
                      <Link to={`/activity/moderate/${activity.id}`} aria-label="Cliquer pour consulter l'activité à modérer" ><FontAwesomeIcon icon={faEye}/></Link>
                    </td>

                  </tr>
                )
              })}
            </tbody>
          </table>
        </article>
      :
        <article>
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
                      <Link to={`/comment/moderate/${comment.id}`}><FontAwesomeIcon icon={faEye} aria-label="Cliquer pour consulter le commentaire à modérer"/></Link>
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

      <hr />

      { categories.length !== 0 ?
        <article className="manage-categories">
          <h2>Gestion des catégories</h2>
          { error !== null && <p>{error}</p>}
            <table >
              <tbody>
                { categories.map((category)=>{
                  return (
                    <tr key={category.id}>
                      <td>
                        <form onSubmit={(e) => {handleSubmit(e, category.id )}}>
                          <label className={`category_${category.id}`}>{category.title}</label>
                          <input className={`category_${category.id}`} type="text" style={{"display": "none", "width": "100%"}} defaultValue={category.title} onChange={(e)=>{setCategory(e.currentTarget.value)}}/>
                        </form>
                      </td>
                      <td>
                        <FontAwesomeIcon icon={faPenToSquare} aria-label='Cliquer pour modifier la catégorie' className={`fa-screwdriver-category_${category.id}`} onClick={() => {displayModifyZone(category.id, category.title)}}/>
                        <FontAwesomeIcon icon={faSquareCheck} aria-label='Cliquer pour valider la modification de la catégorie' className={`fa-check-category_${category.id}`} style={{"display": "none"}} onClick={(e) => {handleSubmit(e, category.id )}}/>
                      </td>
                      <td><FontAwesomeIcon icon={faTrashCan} aria-label="Cliquer pour supprimer la catégorie" onClick={() => {deleteCategory(category.id)}}/></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
        </article>
        :
        <article>
          <h2>Gestion des catégories</h2>
          <p>Aucune catégorie trouvée, veuillez recharger la page.</p>
        </article>
      }

      <article className="create-new-category">
        <h2>Créer une nouvelle catégorie</h2>
          { errorCreateCategory !== null && <p>{errorCreateCategory}</p>}
          <form onSubmit={(e)=>{createCategory(e)}}>
            <input name="newCategory" onChange={(e) => setNewCategory(e.currentTarget.value)} placeholder={"Titre de la catégorie"} />
            <button aria-label="Valider la création de la nouvelle catégorie" >Valider</button>
          </form>
      </article>

    </section>
  )
}

export default Admin;
