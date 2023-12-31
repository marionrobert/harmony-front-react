import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub, faLinkedin} from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
      <footer>
          <a aria-label="Icône de LinkedIn contenant un lien vers la page LinkedIn du créateur du site" href="https://www.linkedin.com/in/marion-robert-" target="_blank" rel='noreferrer'><FontAwesomeIcon icon={faLinkedin}/></a>
          <p>Created by Marion Robert </p>
          <a aria-label="Icône de Github contenant un lien vers la page Github du créateur du site" href="https://github.com/marionrobert" target="_blank" rel='noreferrer'><FontAwesomeIcon icon={faGithub} /></a>
          <p className="contact-me">Si vous avez des remarques ou questions, contactez-moi sur Linkedin / If you have any comments or questions, contact me on Linkedin</p>
      </footer>
  )
}

export default Footer
