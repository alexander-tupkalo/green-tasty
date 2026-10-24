import { useParams, Link } from 'react-router-dom'
import { getRestaurantBySlug, RESTAURANTS } from '../data/restaurants.js'
import './RestaurantDetail.css'

function RestaurantDetail() {
  const { slug } = useParams()
  const restaurant = getRestaurantBySlug(slug)

  // --- Not-found state for unknown slug ---
  if (!restaurant) {
    return (
      <div className="restaurant-detail">
        <div className="restaurant-detail__not-found">
          <p className="restaurant-detail__not-found-code">404</p>
          <h1 className="restaurant-detail__not-found-title">
            Restaurant not found
          </h1>
          <p className="restaurant-detail__not-found-lead">
            We could not find a restaurant at this address. It may have
            moved, or the link may be incorrect.
          </p>
          <Link to="/restaurants" className="restaurant-detail__not-found-link">
            Back to all restaurants
          </Link>
        </div>
      </div>
    )
  }

  // --- Detail page ---
  return (
    <div className="restaurant-detail">
      {/* Hero */}
      <section className="restaurant-detail__hero">
        <div className="restaurant-detail__hero-image-wrap">
          <img
            src={restaurant.image}
            alt={restaurant.imageAlt}
            className="restaurant-detail__hero-image"
          />
        </div>

        <div className="restaurant-detail__hero-content">
          <p className="restaurant-detail__eyebrow">
            {restaurant.area.toUpperCase()}
          </p>
          <h1 className="restaurant-detail__title">{restaurant.name}</h1>
          <p className="restaurant-detail__address">{restaurant.address}</p>
          <p className="restaurant-detail__short">
            {restaurant.shortDescription}
          </p>

          <div className="restaurant-detail__actions">
            <Link
              to="/reservations"
              className="restaurant-detail__cta restaurant-detail__cta--primary"
              aria-label={`Book a table at ${restaurant.name}`}
            >
              Book a Table
            </Link>
            <Link
              to="/menu"
              className="restaurant-detail__cta restaurant-detail__cta--secondary"
              aria-label={`View the menu for ${restaurant.name}`}
            >
              View Menu
            </Link>
          </div>

          <p className="restaurant-detail__booking-note">
            Reservations are demo only — your table is not confirmed
            until real booking is connected.
          </p>
        </div>
      </section>

      {/* About */}
      <section className="restaurant-detail__about">
        <p className="restaurant-detail__section-eyebrow">ABOUT</p>
        <h2 className="restaurant-detail__section-title">The room</h2>
        <p className="restaurant-detail__long">{restaurant.longDescription}</p>
      </section>

      {/* Opening hours */}
      <section className="restaurant-detail__hours">
        <p className="restaurant-detail__section-eyebrow">OPENING HOURS</p>
        <h2 className="restaurant-detail__section-title">When to come</h2>

        <p className="restaurant-detail__hours-demo">Demo hours — not final</p>

        <ul className="restaurant-detail__hours-list">
          {restaurant.hours.map((row) => (
            <li key={row.day} className="restaurant-detail__hours-row">
              <span className="restaurant-detail__hours-day">{row.day}</span>
              <span className="restaurant-detail__hours-time">{row.time}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Other restaurants */}
      <section className="restaurant-detail__others">
        <p className="restaurant-detail__section-eyebrow">OTHER LOCATIONS</p>
        <h2 className="restaurant-detail__section-title">Also visit</h2>

        <ul className="restaurant-detail__others-list">
          {RESTAURANTS.filter((r) => r.slug !== restaurant.slug).map((r) => (
            <li key={r.slug} className="restaurant-detail__others-item">
              <Link
                to={`/restaurants/${r.slug}`}
                className="restaurant-detail__others-link"
              >
                <span className="restaurant-detail__others-name">{r.name}</span>
                <span className="restaurant-detail__others-area">{r.area}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Bottom CTA */}
      <section className="restaurant-detail__bottom-cta">
        <p className="restaurant-detail__bottom-cta-eyebrow">EXPLORE</p>
        <h2 className="restaurant-detail__bottom-cta-title">
          See what we cook.
        </h2>
        <p className="restaurant-detail__bottom-cta-lead">
          The same menu is served across all three Green Tasty locations.
        </p>
        <Link to="/menu" className="restaurant-detail__bottom-cta-button">
          View Menu
        </Link>
      </section>
    </div>
  )
}

export default RestaurantDetail