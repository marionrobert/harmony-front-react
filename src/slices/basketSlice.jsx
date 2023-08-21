import { createSlice } from "@reduxjs/toolkit";

//récupération du panier dans le localStorage
let currentBasket = JSON.parse(localStorage.getItem("harmony-basket"))
if (currentBasket === null){
  currentBasket = []
}

function calculateTotalAmount(basket){
  let points = 0
  basket.forEach(activity => {
    points += parseInt(activity.quantityInCart) * parseFloat(activity.points)
  });
  return points
}

let totalPoints = calculateTotalAmount(currentBasket)

// création state initiale
const initialState = {
  basket: currentBasket,
  totalAmount: totalPoints
}

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    updateBasket: (state, action) => {
      let totalPoints = calculateTotalAmount(action.payload)
      state.basket = action.payload,
      state.totalAmount = totalPoints
    },
    cleanBasket: (state) => {
      state.basket = [],
      state.totalAmount = 0
    }
  }
})

export const {updateBasket, cleanBasket} = basketSlice.actions

export const selectBasket = state => state.basket

export default basketSlice.reducer
