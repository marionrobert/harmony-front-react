import {config} from "../config"
import { Link } from "react-router-dom"
import {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';

import { selectUser } from '../slices/userSlice';
import { selectBasket } from '../slices/basketSlice';

import { FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faBagShopping, faUser, faUserGear, faXmark, faUserCheck} from "@fortawesome/free-solid-svg-icons"


const Header = () => {
  const user = useSelector(selectUser)
  const basket = useSelector(selectBasket)
  const [nbItems, setNbItems] = useState(0)

  const displayConnexionMenu = (e) => {
    e.preventDefault()
    // console.log("have been clicked!")
    const connexionMenu = document.querySelector("div.connexion-menu")
    connexionMenu.classList.add("display-menu")
  }

  const closeConnexionMenu = (e) => {
    // console.log("close connexion-menu")
    e.preventDefault()
    const connexionMenu = document.querySelector("div.connexion-menu")
    connexionMenu.classList.remove("display-menu")
  }

  useEffect(()=>{

    let number = 0
    basket.basket.forEach(item => {
      number += item.quantityInCart
    });
    setNbItems(number)
  }, [basket])

  return (
    <header>
      <nav id="navbar-menu">
        <div id="brand">
          <Link to="/">
            <img src={`${config.pict_url}/icons/lifetree.avif`} className="brand-icon" alt="Logo représentant un arbre de vie"/>
          </Link>
          <Link to="/"><span>Harmony</span></Link>
        </div>

        <div id="other-links">
          { user.isLogged ?
            <Link id="user" to={user.data.role === "user" ? '/profile' : "/admin"}>
              <FontAwesomeIcon icon={ user.data.role === "user" ? faUserCheck : faUserGear}/>
            </Link>
            :
            <Link id="user" onClick={(e) => {displayConnexionMenu(e)}}><FontAwesomeIcon icon={ faUser}/></Link>
          }
          <Link id="basket" to="/basket" className="nav-link link-to-basket"><FontAwesomeIcon icon={faBagShopping}/>{ nbItems > 0 && <span className='nbItems'>{nbItems}</span>}</Link>
        </div>
      </nav>
      <div className='connexion-menu' onMouseLeave={closeConnexionMenu}>
        <FontAwesomeIcon icon={faXmark} onClick={closeConnexionMenu}/>
        <button><Link to='/login' onClick={closeConnexionMenu}  className="connexion-menu-link">Se connecter</Link></button>
        <button><Link to='/register' onClick={closeConnexionMenu} className="connexion-menu-link">Créer un compte</Link></button>
      </div>
    </header>
  )
}

export default Header;
