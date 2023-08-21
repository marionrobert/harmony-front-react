import { createSlice } from "@reduxjs/toolkit"

// création state initiale - contenu par défaut
const initialState = {
  activities: []
}

// création de la state qui incluera les fonctions de modifications (createSlice crée automatiquement les reducers et les actions) : il faut paramétrer
export const activitySlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    setOnlineActivities: (state, action) => {
      state.activities = action.payload
    } // réception dans l'argument action de la valeur retournée par la requète axios dans nos composants
  }
})

// fonctions écoutées par le reducer = actions --> accès de react-redux aux states depuis n'importe quel composant
export const {setOnlineActivities} = activitySlice.actions

// déclaration de la state manipulable dans les composants
export const selectActivities = state => state.activities

// exportation de la slice en tant que reducer --> injection dans le store --> accessible et manipulable
export default activitySlice.reducer
