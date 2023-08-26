import { Link } from "react-router-dom"
import ActivityCard from "../components/activity-card"
import CommentCard from "../components/comment-card"
import { useEffect, useState } from "react";

//on importer des fonctions pour lire ou modifier les states globales présentes dans le store de redux
import {useSelector, useDispatch} from "react-redux"
//import des states globales product et basket et de leurs actions (ajout au panier, chargement des produits)
import {selectBasket, updateBasket} from "../slices/basketSlice"
import { selectActivities, setOnlineActivities } from "../slices/activitySlice";

import { getAllHighScoreComments } from "./../api/comment"




const Home = () => {
  const allActivities = useSelector(selectActivities)
  const [comments, setComments ]= useState([])
  const currentBasket = useSelector(selectBasket)

  useEffect(() => {
    getAllHighScoreComments()
    .then((res)=>{
      if (res.status === 200){
        setComments(res.comments)
      }
    })
    .catch((err) => {
      console.log("err -->", err)
    })
  }, [])

  return (
    <>
      <section className="home-banner">
        <h1>Bienvenue sur <span className="brand-name">Harmony</span></h1>
        <p>Apprenez à connaître vos voisins en échangeant des coups de main !</p>
        <button className="banner-btn"><Link to="/activities"> Découvrir les activités</Link></button>
      </section>

      { allActivities.activities.length > 0 &&
        <section className="section-activities">
          <h2>Quelques activités à découvrir</h2>
          {allActivities.activities.slice(-10).map(activity => {
            return <ActivityCard key={activity.id} activity={activity} />
          })}
        </section>
      }

      { comments.length > 0 &&
      <section className="section-comments">
        <h2>Ils ont essayé, ils ont adoré !</h2>
        {comments.slice(-10).map(comment => {
          return <CommentCard key={comment.id} comment={comment} />
        })}

      </section>}
    </>
  );
};

export default Home;
