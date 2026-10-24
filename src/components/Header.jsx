import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import logoImage from '../assets/logo.png'
import './Header.css'

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/restaurants', label: 'Restaurants', end: false },
  { to: '/menu', label: 'Menu', end: false },
  { to: '/account', label: 'Account', end: false },
]

function CartIcon() {
  return (
    <svg
      className="header__cart-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { totalCount } = useCart()

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__brand" onClick={closeMenu}>
          <img
            src={logoImage}
            alt="Green Tasty — Healthy Eaters Restaurant"
            className="header__brand-logo"
          />
        </Link>

        <button
          type="button"
          className="header__burger"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="header__burger-bar" />
          <span className="header__burger-bar" />
          <span className="header__burger-bar" />
        </button>

        <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
          <ul className="header__nav-list">
            {NAV_LINKS.map((link) => (
              <li key={link.to} className="header__nav-item">
                <NavLink
                  to={link.to}
                  end={link.end}
                  className="header__nav-link"
                  onClick={closeMenu}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <Link to="/signin" className="header__signin" onClick={closeMenu}>
            Sign In
          </Link>

          <Link
            to="/cart"
            className="header__cart"
            onClick={closeMenu}
            aria-label={`Cart, ${totalCount} item${totalCount === 1 ? '' : 's'}`}
          >
            <CartIcon />
            {totalCount > 0 && (
              <span className="header__cart-badge">{totalCount}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header