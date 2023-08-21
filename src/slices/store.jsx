import { configureStore } from "@reduxjs/toolkit";

// importation des slices à injecter dans le store
import userReducer from "./userSlice";
import activityReducer from "./activitySlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    activities: activityReducer
  }
})

export default store
