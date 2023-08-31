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
          <CloudinaryContext cloudName="dptcisxbs">
            <div>
              <Image publicId={activity.urlPicture} id='profilImg' >
                <Transformation quality="auto" fetchFormat="auto" />
              </Image>
            </div>
          </CloudinaryContext> :
          <img src={`${config.pict_url}/no-image.png`} /> }
        { author !== null && author.avatar !== null ? <img src={author.avatar} className="activity-card-avatar"/> : <img src={`${config.pict_url}/user.png`} className="activity-card-avatar"/> }
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
