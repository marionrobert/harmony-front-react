import { Link } from "react-router-dom"
import ActivityCard from "../components/activity-card"
import CommentCard from "../components/comment-card"
import { useEffect, useState } from "react";

//on importer des fonctions pour lire ou modifier les states globales présentes dans le store de redux
import {useSelector} from "react-redux"
import { selectActivities} from "../slices/activitySlice";

import { getAllHighScoreComments } from "./../api/comment"


const Home = () => {
  const allActivities = useSelector(selectActivities)
  const [comments, setComments ]= useState([])

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
        <Link to="/activities" className="banner-btn"> Découvrir les activités</Link>
      </section>


      <section className="introduction">
        <h2>Notre vision</h2>
        <div>
          <p>Harmony est né d'un constat simple. Les personnes bénéficiant d'une protection internationale de la France ont vocation à s'installer durablement en France du fait de leur situation. Or, ces dernières éprouvent souvent des difficultés à s'intégrer dans leur pays d'adoption. Chez Harmony, nous sommes convaincus que l'intégration des personnes protégées peut être facilitée à l'échelle de la ville. Malheureusement, on peut constater un manque d’interactions sociales entre les habitants de longue date et les personnes protégées nouvellement arrivées. Cette absence d’échanges est la conséquence d’une méconnaissance de l’autre et d’idées préconçues et codnuit à un sentiment d’exclusion. </p>
          <p>Face à ce constat, Harmony souhaite favoriser l’inclusion des personnes protégées en développant les échanges et la solidarité entre les habitants d'une même ville. Cette solidarité naîtra de l’échange de coups de main entre voisins. Sur notre site, vous pouvez proposer une activité et réserver une activité pour donner et.ou recevoir un coup de main de la part de vos voisins. En réalisant un coup de main pour quelqu'un, vous gagnez des points que vous pourrez utiliser à votre tour pour obtenir de l'aide auprès d'autres utilisateurs. Toutes les activités sont à réaliser ensemble. Celui.celle qui poste une annonce ou qui réserve une activité s'engage à la réaliser avec son.sa voisin.e. L'objectif d'Harmony est de favoriser les interactions sociales et la solidarité entre les habitants de la ville et non de faire réaliser des travaux gratuitement.</p>
        </div>
      </section>

      { allActivities.activities.length > 0 &&
      <section className="section-activities">
        <h2>Les dernières activités postées</h2>
        {allActivities.activities.slice(0, 8).map(activity => {
          return <ActivityCard key={activity.id} activity={activity} />
        })}
        <div className="btn-all-activities">
          <Link to="/activities"> Découvrir toutes les activités</Link>
        </div>
      </section>
      }


      { comments.length > 0 &&
      <section className="section-comments">
        <h2>Essayez Harmony, vous serez ravi.e.s !</h2>
        {comments.slice(-4).map(comment => {
          return <CommentCard key={comment.id} comment={comment} />
        })}
      </section>}
    </>
  );
};

export default Home;
