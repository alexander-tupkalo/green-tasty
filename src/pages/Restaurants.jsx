import { Link } from 'react-router-dom'
import { RESTAURANTS } from '../data/restaurants.js'
import './Restaurants.css'

function Restaurants() {
  return (
    <div className="restaurants">
      {/* 1. Intro */}
      <section className="restaurants__intro">
        <p className="restaurants__eyebrow">OUR RESTAURANTS</p>
        <h1 className="restaurants__title">
          Three tables across Tbilisi.
        </h1>
        <p className="restaurants__lead">
          Green Tasty brings together three Georgian restaurants under
          one roof of hospitality. Each room has its own character,
          but all share the same kitchen, the same herbs, and the same
          welcome.
        </p>
        <p className="restaurants__disclaimer">
          Provisional demo addresses — not verified real businesses.
          Detailed restaurant pages are coming later; for now every
          card links to the menu.
        </p>
      </section>

      {/* 2. Restaurant cards */}
      <section className="restaurants__list">
        <ul className="restaurants__grid">
          {RESTAURANTS.map((restaurant) => (
            <li key={restaurant.slug} className="restaurant-card">
              <div className="restaurant-card__visual">
                <img
                  src={restaurant.image}
                  alt={restaurant.imageAlt}
                  className="restaurant-card__image"
                  loading="lazy"
                />
              </div>

              <div className="restaurant-card__body">
                <div className="restaurant-card__heading">
                  <h2 className="restaurant-card__name">{restaurant.name}</h2>
                  <span className="restaurant-card__area">{restaurant.area}</span>
                </div>

                <div className="restaurant-card__address-row">
                  <span className="restaurant-card__address">{restaurant.address}</span>
                  <span className="restaurant-card__demo">Demo</span>
                </div>

                <p className="restaurant-card__description">
                  {restaurant.shortDescription}
                </p>

                <div className="restaurant-card__footer">
                  <Link
                    to={`/restaurants/${restaurant.slug}`}
                    className="restaurant-card__cta"
                    aria-label={`View details for ${restaurant.name}`}
                  >
                    View Restaurant
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default Restaurants