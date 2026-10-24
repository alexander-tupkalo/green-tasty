import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePreorder } from '../context/PreorderContext.jsx'
import { FOOD_CATEGORIES, BAR_CATEGORIES, CATEGORY_NAV } from '../data/menu.js'
import MenuCard from '../components/MenuCard.jsx'
import './Preorder.css'

// Local nav without "All" — pre-order always shows one category at a time.
const PREORDER_NAV = CATEGORY_NAV.filter((item) => item.id !== 'all')

function formatPrice(num) {
  return `$${num.toFixed(2)}`
}

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function Preorder() {
  const {
    booking,
    items,
    totalCount,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearPreorder,
  } = usePreorder()

  const [activeCategory, setActiveCategory] = useState('khachapuri')
  const navRef = useRef(null)
  const navigate = useNavigate()

  const handleCategoryClick = (id) => {
    setActiveCategory(id)
    if (navRef.current) {
      const top =
        navRef.current.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const handleContinueToConfirmation = () => {
    navigate('/reservations/confirmation')
  }

  const handleBackToSearch = () => {
    navigate('/reservations')
  }

  // --- No booking state — user landed here directly ---
  if (!booking) {
    return (
      <div className="preorder-page">
        <div className="preorder-page__inner">
          <div className="preorder__no-booking">
            <h1 className="preorder__no-booking-title">
              No table selected
            </h1>
            <p className="preorder__no-booking-text">
              You need to pick a table first. Head back to the
              reservation page, search for an available table, and
              choose a time slot — then you can pre-order dishes.
            </p>
            <Link to="/reservations" className="preorder__no-booking-cta">
              Find a table
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Find the active category across food + bar.
  // Special case: "drinks" is a parent nav item that shows all
  // bar sub-categories (Soft, Wine, Spirits) together.
  const allCategories = [...FOOD_CATEGORIES, ...BAR_CATEGORIES]
  const isDrinks = activeCategory === 'drinks'
  const activeCategoryData = isDrinks
    ? null
    : allCategories.find((c) => c.id === activeCategory)

  return (
    <div className="preorder-page">
      <div className="preorder-page__inner">
        <div className="preorder__layout">
          {/* Menu side */}
          <div className="preorder__menu-side">
            <header className="preorder__header">
              <p className="preorder__eyebrow">PRE-ORDER FOR YOUR TABLE</p>
              <h1 className="preorder__title">Add dishes to your booking</h1>
              <p className="preorder__lead">
                Pick food and drinks from our menu — they will be ready
                when you arrive. You can review and edit everything
                before confirming the booking.
              </p>
              <p className="preorder__optional-note">
                Pre-order is optional — you can skip this step and
                just reserve the table.
              </p>
            </header>

            {/* Category navigation (no "All" option) */}
            <nav
              ref={navRef}
              className="preorder__nav"
              aria-label="Menu categories"
            >
              <ul className="preorder__nav-list">
                {PREORDER_NAV.map((item) => (
                  <li key={item.id} className="preorder__nav-item">
                    <button
                      type="button"
                      className={`preorder__nav-link ${
                        activeCategory === item.id ? 'preorder__nav-link--active' : ''
                      }`}
                      aria-pressed={activeCategory === item.id}
                      onClick={() => handleCategoryClick(item.id)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Active category (single) */}
            {activeCategoryData && !isDrinks && (
              <section
                className="preorder__section"
                aria-labelledby="preorder-active-heading"
              >
                <div className="preorder__section-header">
                  <p className="preorder__section-eyebrow">
                    {BAR_CATEGORIES.some((c) => c.id === activeCategory)
                      ? 'BAR MENU'
                      : 'FOOD MENU'}
                  </p>
                  <h2
                    id="preorder-active-heading"
                    className="preorder__section-title"
                  >
                    {activeCategoryData.title}
                  </h2>
                </div>

                <div className="preorder__categories">
                  <section className="preorder__category">
                    <ul className="preorder__category-items">
                      {activeCategoryData.items.map((item) => (
                        <MenuCard
                          key={item.name}
                          item={item}
                          onAdd={addItem}
                          buttonLabel="Add to pre-order"
                        />
                      ))}
                    </ul>
                  </section>
                </div>
              </section>
            )}

            {/* Drinks — all 3 bar sub-categories together */}
            {isDrinks && (
              <section
                className="preorder__section preorder__section--bar"
                aria-labelledby="preorder-drinks-heading"
              >
                <div className="preorder__section-header">
                  <p className="preorder__section-eyebrow">BAR MENU</p>
                  <h2
                    id="preorder-drinks-heading"
                    className="preorder__section-title"
                  >
                    From our bar
                  </h2>
                </div>

                <div className="preorder__categories">
                  {BAR_CATEGORIES.map((category) => (
                    <section
                      key={category.id}
                      className="preorder__category"
                    >
                      <h3 className="preorder__category-title">
                        {category.title}
                      </h3>
                      <ul className="preorder__category-items">
                        {category.items.map((item) => (
                          <MenuCard
                            key={item.name}
                            item={item}
                            onAdd={addItem}
                            buttonLabel="Add to pre-order"
                          />
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Summary side (sticky on desktop) */}
          <aside className="preorder__summary" aria-label="Pre-order summary">
            {/* Booking details */}
            <div className="preorder__summary-booking">
              <p className="preorder__summary-eyebrow">YOUR TABLE</p>
              <h2 className="preorder__summary-restaurant">
                {booking.restaurant.name}
              </h2>
              <p className="preorder__summary-address">
                {booking.restaurant.address}
              </p>

              <dl className="preorder__summary-details">
                <div className="preorder__summary-row">
                  <dt>Date</dt>
                  <dd>{formatDate(booking.date)}</dd>
                </div>
                <div className="preorder__summary-row">
                  <dt>Time</dt>
                  <dd>{booking.time}</dd>
                </div>
                <div className="preorder__summary-row">
                  <dt>Guests</dt>
                  <dd>
                    {booking.guests}{' '}
                    {booking.guests === 1 ? 'guest' : 'guests'}
                  </dd>
                </div>
                <div className="preorder__summary-row">
                  <dt>Table</dt>
                  <dd>{booking.tableId}</dd>
                </div>
              </dl>

              <button
                type="button"
                className="preorder__change-table"
                onClick={handleBackToSearch}
              >
                ← Change table
              </button>
            </div>

            {/* Pre-order items */}
            <div className="preorder__summary-items">
              <div className="preorder__summary-items-header">
                <h3 className="preorder__summary-items-title">
                  Pre-order
                </h3>
                {items.length > 0 && (
                  <button
                    type="button"
                    className="preorder__clear-btn"
                    onClick={clearPreorder}
                  >
                    Clear all
                  </button>
                )}
              </div>

              {items.length === 0 ? (
                <p className="preorder__empty">
                  No dishes yet. Browse the categories above and add
                  something tasty — or skip this step and just reserve
                  the table.
                </p>
              ) : (
                <ul className="preorder__item-list">
                  {items.map((item) => {
                    const price =
                      parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0
                    const lineTotal = price * item.quantity
                    return (
                      <li key={item.id} className="preorder__item">
                        <div className="preorder__item-info">
                          <p className="preorder__item-name">{item.name}</p>
                          <p className="preorder__item-price">
                            {item.price} each
                          </p>
                        </div>

                        <div className="preorder__item-controls">
                          <div
                            className="preorder__item-qty"
                            role="group"
                            aria-label={`Quantity for ${item.name}`}
                          >
                            <button
                              type="button"
                              className="preorder__qty-btn"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              −
                            </button>
                            <span
                              className="preorder__qty-value"
                              aria-live="polite"
                            >
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className="preorder__qty-btn"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              +
                            </button>
                          </div>

                          <span className="preorder__item-line-total">
                            {formatPrice(lineTotal)}
                          </span>

                          <button
                            type="button"
                            className="preorder__item-remove"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.name} from pre-order`}
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {/* Total + checkout */}
            <div className="preorder__summary-total">
              <div className="preorder__summary-total-row">
                <span className="preorder__summary-total-label">
                  Items
                </span>
                <span className="preorder__summary-total-value">
                  {totalCount}
                </span>
              </div>
              <div className="preorder__summary-total-row preorder__summary-total-row--grand">
                <span className="preorder__summary-total-label">
                  Pre-order total
                </span>
                <span
                  className="preorder__summary-total-value"
                  aria-live="polite"
                >
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="preorder__summary-total-note">
                Taxes and service fees, if any, will be calculated at
                confirmation.
              </p>
            </div>

            <button
              type="button"
              className="preorder__confirm-btn"
              onClick={handleContinueToConfirmation}
            >
              Continue to confirmation
            </button>

            {items.length === 0 && (
              <p className="preorder__skip-note">
                You can pre-order later or skip this step — your table
                is held in this session.
              </p>
            )}

            <p className="preorder__summary-disclaimer">
              DEMO · Pre-order is not sent to the restaurant. Real
              booking flow is coming soon.
            </p>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Preorder