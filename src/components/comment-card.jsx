import { config } from "../config"
import { getOneUserById } from "../api/user"
import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar as fullStar} from "@fortawesome/free-solid-svg-icons"
import { faStar } from "@fortawesome/free-regular-svg-icons"
import { Image, Transformation, CloudinaryContext} from "cloudinary-react";


const CommentCard = (props) => {
  const comment = props.comment
  const [author, setAuthor] = useState(null)

  useEffect(()=> {
    getOneUserById(comment.author_id)
    .then((res)=>{
      if (res.status === 200){
        setAuthor(res.user)
      }
    })
    .catch((err)=>{
      console.log("err -->", err)
    })
  }, [comment])

  return (
    <>
      { comment !== null && author !== null && <article className="comment-card">

        { author.avatar !== null ?
          <CloudinaryContext cloudName="dptcisxbs" className="comment-card-avatar">
            <div>
              <Image className="comment-card-avatar" publicId={author.avatar} alt={`Photo de l'utilisateur ${author.firstName} ${author.lastName}`}>
                <Transformation quality="auto" fetchFormat="auto" />
              </Image>
            </div>
          </CloudinaryContext>
          :
          <img src={`${config.pict_url}/user.png`} className="comment-card-avatar" alt="Pas d'image disponible"/>
        }

        <div className="comment-card-data">
          <h3 className="comment-card-username" >{author.firstName} {author.lastName.substring(0, 1).toUpperCase()}.</h3>
          <p className="comment-card-score">
            <FontAwesomeIcon icon={fullStar}/>
            <FontAwesomeIcon icon={fullStar}/>
            <FontAwesomeIcon icon={fullStar}/>
            <FontAwesomeIcon icon={fullStar}/>
            { comment.score === 5 ? <FontAwesomeIcon icon={fullStar}/> : <FontAwesomeIcon icon={faStar}/> } {comment.score}/5
          </p>
        </div>

        <h3 className="comment-card-title">{comment.title}</h3>
        <p className="comment-card-content">« {comment.content} »</p>
      </article>
      }
    </>

  )
}

export default CommentCard;
