import { configureStore } from "@reduxjs/toolkit";

// importation des slices à injecter dans le store
import userReducer from "./userSlice";
import activityReducer from "./activitySlice";
import basketReducer from "./basketSlice"

const store = configureStore({
  reducer: {
    user: userReducer,
    activities: activityReducer,
    basket: basketReducer
  }
})

export default store
