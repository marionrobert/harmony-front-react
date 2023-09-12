import { useSelector } from "react-redux";
import { selectActivities } from "../slices/activitySlice";
import { selectBasket, updateBasket } from "../slices/basketSlice";
import ActivityCard from "../components/activity-card"

const Activities = () => {
  const activities = useSelector(selectActivities)

  return (
    <>
      { activities.activities.length > 0 &&
        <section className="section-activities">
          <h1>Toutes les activités disponibles</h1>
          {activities.activities.map(activity => {
            return <ActivityCard key={activity.id} activity={activity} />
          })}
        </section>
      }
    </>
  )
}

export default Activities;
