import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <Link to="/" className="footer__brand">
          Green Tasty
        </Link>
        <p className="footer__tagline">
          Green by nature, Georgian by heart.
        </p>
        <p className="footer__copyright">
          &copy; {year} Green Tasty. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer