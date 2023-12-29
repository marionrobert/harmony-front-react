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
  const [comments, setComments ]= useState([]);

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
        <div className="part-1">
          <h2>Notre vision</h2>
          <p>Harmony est né d'un constat simple. Les personnes bénéficiant d'une protection internationale ont vocation à s'installer durablement en France du fait de leur situation mais elles éprouvent souvent des difficultés à s'intégrer. Nous sommes convaincus que leur intégration peut être facilitée à l'échelle de la ville. Malheureusement, on constate en général un manque d’interactions sociales entre les habitants de longue date et les personnes protégées nouvellement arrivées. Cela est la conséquence directe d’une méconnaissance de l’autre et d’idées préconçues. Le but de notre projet est de favoriser l’inclusion des personnes protégées en développant les échanges et la solidarité entre les habitants d'une même ville. Cette solidarité naîtra de l’échange de coups de main entre voisins. Sur notre site, vous pouvez proposer et/ou réserver une activité pour donner et/ou recevoir un coup de main de la part de vos voisins. En réalisant un coup de main pour quelqu'un, vous gagnez des points que vous pourrez ensuite utiliser pour obtenir de l'aide auprès d'autres utilisateurs.</p>

        </div>
        <div className="part-2">
          <h2>Projet porté par la ville d'Angers</h2>
          <iframe
            src="https://www.youtube.com/embed/ilTr9Fg-Aa4?autoplay=1&mute=1"
            title="Vidéo de présentation de la ville d'Angers"
          />
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
