import { Link } from 'react-router-dom'
import './NotFound.css'

function NotFound() {
  return (
    <div className="not-found">
      <p className="not-found__code">404</p>
      <h1 className="not-found__title">Page not found</h1>
      <p className="not-found__lead">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="not-found__link">
        Back to home
      </Link>
    </div>
  )
}

export default NotFound