import {config} from "../config"
import { Link } from "react-router-dom"

const Header = () => {

  return (
    <header>
      <nav id="navbar-menu">
        <div id="brand">
          <Link to="/">
            <img src={`${config.pict_url}/icons/lifetree.avif`} className="brand-icon" alt="Logo représentant un arbre de vie"/>
          </Link>
          <Link to="/"><span>Harmony</span></Link>
        </div>
      </nav>
    </header>
  )
}

export default Header;
