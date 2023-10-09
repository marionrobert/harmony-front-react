import { config } from "../config"
import { Link } from "react-router-dom"
import { getOneUserById } from "../api/user"
import { useState, useEffect } from "react"
import { Image, Transformation, CloudinaryContext} from "cloudinary-react";

const ActivityCard = (props) => {
  const activity = props.activity
  const [author, setAuthor] = useState(null)

  useEffect(()=> {
    getOneUserById(activity.author_id)
    .then((res)=>{
      if (res.status === 200){
        setAuthor(res.user)
      }
    })
    .catch((err)=>{
      console.log("err -->", err)
    })
  }, [activity])

  return (
    <>
      { activity !== null && <article className="activity-card">
        { activity.urlPicture !== null ?
          <CloudinaryContext cloudName="dptcisxbs" className="activity-card-picture">

              <Image publicId={activity.urlPicture} className="activity-card-picture" alt={`Image de l'activité ${activity.title}`}>
                <Transformation quality="auto" fetchFormat="auto" />
              </Image>

          </CloudinaryContext> :
          <img src={`${config.pict_url}/no-image.png`} className="activity-card-picture" alt="Pas d'image disponible"/>
        }

        { author !== null && author.avatar !== null ?
          <CloudinaryContext cloudName="dptcisxbs" className="activity-card-avatar">
            <div>
              <Image className="activity-card-avatar" publicId={author.avatar} alt="Photo de l'utilisateur proposant l'activité">
                <Transformation quality="auto" fetchFormat="auto" />
              </Image>
            </div>
          </CloudinaryContext>
          :
          <img src={`${config.pict_url}/user.png`} className="activity-card-avatar" alt="Icône d'utilisateur par défault"/>
        }
        <div className="activity-card-data">
          { activity.title.length > 50 ? <h3>{activity.title.substring(0, 50)}...</h3> : <h3>{activity.title}</h3> }
          <p className="activity-card-description">{activity.description.substring(0, 120)} ...</p>
          <p className="activity-card-points">{activity.points} <span>pts</span></p>
          <Link className="activity-card-btn" to={`/activity/details/${activity.id}`}> Je découvre</Link>
        </div>
      </article>
      }
    </>

  )
}

export default ActivityCard;
