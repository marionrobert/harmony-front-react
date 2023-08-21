import {createSlice} from "@reduxjs/toolkit";

// création state initiale - contenu par défaut
const initialState = {
  data: {},
  isLogged: false
}

// création de la state qui incluera les fonctions de modifications (createSlice crée automatiquement les reducers et les actions) : il faut paramétrer
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.data = action.payload,
      state.isLogged = true
    },
    logoutUser: (state) => {
      state.data = {},
      state.isLogged = false
    }
  }
})

// fonctions écoutées par le reducer = actions --> accès de react-redux aux states depuis n'importe quel composant
export const {setUser, logoutUser} = userSlice.actions

// déclaration de la state manipulable dans les composants
export const selectUser = state => state.user

// exportation de la slice en tant que reducer --> injection dans le store --> accessible et manipulable
export default userSlice.reducer
