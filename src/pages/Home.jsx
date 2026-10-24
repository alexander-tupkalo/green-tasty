import { Link } from 'react-router-dom'
import salad1Image from '../assets/salad1.png'
import salad2Image from '../assets/salad2.png'
import dish1Image from '../assets/green-tasty-dish.jpg'
import dish2Image from '../assets/green-tasty-dish-2.jpg'
import dish3Image from '../assets/green-tasty-dish-3.jpg'
import dish4Image from '../assets/green-tasty-dish-4.jpg'
import rest1Image from '../assets/rest-1.jpg'
import rest2Image from '../assets/rest-2.jpg'
import rest3Image from '../assets/rest-3.jpg'
import './Home.css'

const POPULAR_DISHES = [
  {
    name: 'Georgian Tomato & Cucumber Salad',
    description:
      'Ripe tomatoes, cucumbers, red onion and basil with sunflower oil and tkemali vinegar.',
    price: '$7.50',
    weight: '240g',
    image: dish2Image,
    imageAlt:
      'Georgian tomato and cucumber salad with red onion, basil and sunflower oil on a cream plate',
  },
  {
    name: 'Green Tasty Seasonal Salad',
    description:
      'Our signature bowl — figs, citrus, avocado and herbs with a light pomegranate dressing.',
    price: '$11.00',
    weight: '280g',
    image: dish1Image,
    imageAlt:
      'Signature seasonal salad with figs, citrus, avocado and herbs in a ceramic bowl',
  },
  {
    name: 'Pkhali Assortment',
    description:
      'Three Georgian vegetable pkhali — spinach, beetroot, eggplant — with walnut paste and pomegranate.',
    price: '$8.50',
    weight: '180g',
    image: dish3Image,
    imageAlt:
      'Pkhali assortment — three colorful Georgian vegetable and walnut paste molds on a cream plate',
  },
  {
    name: 'Beetroot & Walnut Salad',
    description:
      'Roasted beetroot, crushed walnuts and prunes with a gentle garlic-walnut sauce.',
    price: '$8.00',
    weight: '200g',
    image: dish4Image,
    imageAlt:
      'Beetroot and walnut salad with prunes and garlic-walnut sauce on a cream plate',
  },
]

const LOCATIONS = [
  {
    address: '9 Abashidze Street',
    image: rest1Image,
    tables: 2,
    occupancy: 90,
    note: 'Bright greenhouse-style dining room with hanging greenery.',
  },
  {
    address: '14 Baratashvili Street',
    image: rest2Image,
    tables: 6,
    occupancy: 70,
    note: 'Cozy brick-walled room with warm pendant lights.',
  },
  {
    address: '48 Rustaveli Avenue',
    image: rest3Image,
    tables: 2,
    occupancy: 85,
    note: 'Pergola-wrapped interior with a wood-paneled bar.',
  },
]

function PinIcon() {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function TablesIcon() {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 9h18" />
      <path d="M5 9v12" />
      <path d="M19 9v12" />
      <path d="M3 21h18" />
      <path d="M9 9V5h6v4" />
    </svg>
  )
}

function Home() {
  return (
    <div className="home">
      {/* 1. Hero */}
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__content">
            <p className="hero__eyebrow">SEASONAL &middot; GEORGIAN &middot; TBILISI</p>
            <h1 className="hero__title">
              Green by nature,
              <br />
              Georgian by heart.
            </h1>
            <p className="hero__lead">
              Three Georgian restaurants, one shared table. Fresh herbs,
              natural wine, and the warm hospitality of Tbilisi — served
              every day.
            </p>
            <div className="hero__actions">
              <Link to="/reservations" className="hero__cta hero__cta--primary">
                Book a table
              </Link>
              <Link to="/restaurants" className="hero__cta hero__cta--secondary">
                Explore Our Restaurants
              </Link>
            </div>
          </div>

          <div className="hero__visual">
            <div className="hero__visual-group">
              <img
                src={salad1Image}
                alt="Seasonal salad with grapefruit, figs, blue cheese, walnuts and herbs in a ceramic bowl"
                className="hero__image hero__image--back"
                loading="lazy"
              />
              <img
                src={salad2Image}
                alt="Fresh salad with avocado slices, cherry tomatoes, carrots and mixed greens in a ceramic bowl"
                className="hero__image hero__image--front"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Our Philosophy */}
      <section className="philosophy">
        <div className="philosophy__inner">
          <p className="section-eyebrow">Our Philosophy</p>
          <h2 className="section-title">
            Food is how Georgia says welcome.
          </h2>
          <div className="philosophy__columns">
            <p className="philosophy__text">
              At Green Tasty we cook the way Georgian families have
              cooked for generations — with what the season gives us.
              Herbs from the market, vegetables from the valley, cheese
              from the mountains, and bread baked the moment you sit
              down.
            </p>
            <p className="philosophy__text">
              We believe a meal is not a transaction but an invitation
              to slow down. Plates arrive to be shared. Wine is poured
              generously. Strangers leave as friends. That is the
              supra — the Georgian feast — and it is at the heart of
              everything we do.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Most Popular Dishes */}
      <section className="dishes">
        <div className="dishes__inner">
          <header className="dishes__header">
            <p className="section-eyebrow">Most Popular Dishes</p>
            <h2 className="section-title">Fresh from our kitchen</h2>
            <p className="section-lead">
              Four seasonal salads that open any Georgian table — bright,
              generous, and made to share. Demo prices and portions.
            </p>
          </header>

          <ul className="dishes__grid">
            {POPULAR_DISHES.map((dish) => (
              <li key={dish.name} className="dish-card">
                <div className="dish-card__visual">
                  <img
                    src={dish.image}
                    alt={dish.imageAlt}
                    className="dish-card__image"
                    loading="lazy"
                  />
                </div>
                <div className="dish-card__body">
                  <div className="dish-card__header">
                    <h3 className="dish-card__name">{dish.name}</h3>
                    <p className="dish-card__price">{dish.price}</p>
                  </div>
                  <p className="dish-card__description">{dish.description}</p>
                  <p className="dish-card__weight">{dish.weight}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Our Locations */}
      <section className="locations">
        <div className="locations__inner">
          <header className="locations__header">
            <p className="section-eyebrow">Our Locations</p>
            <h2 className="section-title">Three tables across Tbilisi</h2>
            <p className="section-lead locations__disclaimer">
              Provisional demo addresses and metrics — not verified
              real businesses.
            </p>
          </header>

          <ul className="locations__grid">
            {LOCATIONS.map((location) => (
              <li key={location.address} className="location-card">
                <div className="location-card__visual">
                  <img
                    src={location.image}
                    alt={`Interior at ${location.address}`}
                    className="location-card__image"
                  />
                </div>
                <div className="location-card__body">
                  <h3 className="location-card__address">
                    <PinIcon />
                    <span>{location.address}</span>
                  </h3>

                  <div className="location-card__stats">
                    <span className="location-card__stat">
                      <TablesIcon />
                      <span>{location.tables} tables</span>
                    </span>
                  </div>

                  <div className="location-card__occupancy">
                    <div className="location-card__occupancy-header">
                      <span>Avg occupancy</span>
                      <span className="location-card__occupancy-value">
                        {location.occupancy}%
                      </span>
                    </div>
                    <div
                      className="location-card__occupancy-bar"
                      role="presentation"
                    >
                      <div
                        className="location-card__occupancy-fill"
                        style={{ width: `${location.occupancy}%` }}
                      />
                    </div>
                  </div>

                  <p className="location-card__note">{location.note}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="locations__cta">
            <Link to="/restaurants" className="link-button link-button--primary">
              View all restaurants
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Final CTA */}
      <section className="final-cta">
        <div className="final-cta__inner">
          <p className="section-eyebrow section-eyebrow--on-brand">
            Begin your evening
          </p>
          <h2 className="final-cta__title">
            Your table is waiting in Tbilisi.
          </h2>
          <p className="final-cta__lead">
            Choose one of our three restaurants and start your Georgian
            evening. Full table booking arrives in a future update —
            for now, explore our restaurants and menu.
          </p>
          <div className="final-cta__actions">
            <Link to="/reservations" className="link-button link-button--on-brand">
              Book a Table
            </Link>
            <Link to="/menu" className="link-button link-button--ghost">
              View Menu
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home