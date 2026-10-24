import { useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useReservations } from '../context/ReservationsContext.jsx'
import { useSharedOrder } from '../context/SharedOrderContext.jsx'
import { FOOD_CATEGORIES, BAR_CATEGORIES } from '../data/menu.js'
import MenuCard from '../components/MenuCard.jsx'
import './SharedOrder.css'

function parsePrice(str) {
  return parseFloat(String(str).replace(/[^0-9.]/g, '')) || 0
}

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

const NAV_ITEMS = [
  { id: 'khachapuri', label: 'Khachapuri' },
  { id: 'starters', label: 'Starters' },
  { id: 'salads', label: 'Salads' },
  { id: 'mains', label: 'Mains' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'drinks', label: 'Drinks' },
]

function SharedOrder() {
  const { id: bookingId } = useParams()
  const { getBookingById } = useReservations()
  const {
    getSharedOrder,
    joinAsGuest,
    getGuestParticipantId,
    addItem,
    removeItem,
    updateItemQuantity,
    closeCollection,
    reopenCollection,
  } = useSharedOrder()

  // If the booking exists in this browser's ReservationsContext,
  // the viewer is the organizer. Otherwise they're a guest.
  const booking = getBookingById(bookingId)
  const isOrganizer = !!booking

  const sharedOrder = getSharedOrder(bookingId)

  const [guestName, setGuestName] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  // Guest's participantId (from localStorage)
  const guestParticipantId = getGuestParticipantId(bookingId)
  const guestParticipant = useMemo(() => {
    if (!sharedOrder || !guestParticipantId) return null
    return (
      sharedOrder.participants.find((p) => p.id === guestParticipantId) || null
    )
  }, [sharedOrder, guestParticipantId])

  const grandTotal = useMemo(() => {
    if (!sharedOrder) return 0
    return sharedOrder.participants.reduce(
      (sum, p) =>
        sum +
        p.items.reduce((s, it) => s + parsePrice(it.price) * it.quantity, 0),
      0
    )
  }, [sharedOrder])

  // --- Shared order not found ---
  if (!sharedOrder) {
    return (
      <div className="shared-order-page">
        <div className="shared-order__inner">
          <div className="shared-order__not-found">
            <h1 className="shared-order__not-found-title">
              Shared order not found
            </h1>
            <p className="shared-order__not-found-lead">
              This shared order doesn't exist in this browser. Ask
              the organizer for a fresh link, or this demo may have
              been cleared.
            </p>
            <Link to="/account" className="shared-order__not-found-link">
              Back to account
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isClosed = sharedOrder.status === 'closed'
  const restaurant = sharedOrder.booking.restaurant
  const organizer = sharedOrder.participants.find((p) => p.isOrganizer)

  const handleCopyLink = () => {
    const url = `${window.location.origin}/account/bookings/${bookingId}/shared`
    navigator.clipboard?.writeText(url).then(() => {
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2500)
    }).catch(() => {
      const textarea = document.createElement('textarea')
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand('copy')
        setLinkCopied(true)
        setTimeout(() => setLinkCopied(false), 2500)
      } catch (e) {
        /* ignore */
      }
      document.body.removeChild(textarea)
    })
  }

  const handleJoin = (e) => {
    e.preventDefault()
    const name = guestName.trim()
    if (!name) return
    joinAsGuest(bookingId, name)
  }

  const handleCloseCollection = () => {
    const ok = window.confirm(
      'Close the shared order collection?\n\nNo one will be able to add or edit items after this. You can reopen it later.'
    )
    if (ok) closeCollection(bookingId)
  }

  // ============================================================
  // GUEST — hasn't joined yet
  // ============================================================
  if (!isOrganizer && !guestParticipant) {
    return (
      <div className="shared-order-page">
        <div className="shared-order__inner">
          <header className="shared-order__header">
            <p className="shared-order__eyebrow">YOU'RE INVITED</p>
            <h1 className="shared-order__title">
              Join {organizer?.name || 'the organizer'}'s table
            </h1>
            <p className="shared-order__subhead">
              {restaurant.name} · {formatDate(sharedOrder.booking.date)} ·{' '}
              {sharedOrder.booking.time} · {sharedOrder.booking.guests} guests
            </p>
          </header>

          <form className="shared-order__join-card" onSubmit={handleJoin}>
            <label htmlFor="guestName" className="shared-order__label">
              Your name
            </label>
            <input
              id="guestName"
              type="text"
              className="shared-order__input"
              placeholder="e.g. Dimitri"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              autoFocus
              required
            />
            <p className="shared-order__hint">
              You'll be able to add dishes and drinks to this shared
              order. Everyone will see what you picked.
            </p>
            <button type="submit" className="shared-order__primary-btn">
              Join & start my order
            </button>
            <p className="shared-order__demo-note">
              Demo · Runs in this browser only. Cross-device sync
              arrives with the backend.
            </p>
          </form>
        </div>
      </div>
    )
  }

  // ============================================================
  // JOINED — organizer or guest
  // ============================================================
  // The "me" participant: organizer (first one) or the joined guest.
  const me = isOrganizer
    ? organizer
    : guestParticipant

  return (
    <div className="shared-order-page">
      <div className="shared-order__inner">
        {/* Header */}
        <header className="shared-order__header">
          <div className="shared-order__header-row">
            <div>
              <p className="shared-order__eyebrow">
                {isOrganizer ? 'YOUR SHARED ORDER' : "YOU'RE INVITED"}
              </p>
              <h1 className="shared-order__title">
                {restaurant.name}
              </h1>
              <p className="shared-order__subhead">
                {formatDate(sharedOrder.booking.date)} ·{' '}
                {sharedOrder.booking.time} ·{' '}
                {sharedOrder.booking.guests} guests
              </p>
            </div>
            <span
              className={`shared-order__status shared-order__status--${sharedOrder.status}`}
            >
              {isClosed ? 'Closed' : 'Open'}
            </span>
          </div>

          {/* Organizer toolbar */}
          {isOrganizer && (
            <div className="shared-order__toolbar">
              <button
                type="button"
                className="shared-order__toolbar-btn"
                onClick={handleCopyLink}
              >
                {linkCopied ? 'Link copied ✓' : 'Copy invite link'}
              </button>
              {!isClosed ? (
                <button
                  type="button"
                  className="shared-order__toolbar-btn shared-order__toolbar-btn--danger"
                  onClick={handleCloseCollection}
                >
                  Close collection
                </button>
              ) : (
                <button
                  type="button"
                  className="shared-order__toolbar-btn"
                  onClick={() => reopenCollection(bookingId)}
                >
                  Reopen collection
                </button>
              )}
            </div>
          )}

          {linkCopied && (
            <p className="shared-order__link-note">
              Link copied. Send it to your friends — they'll be able
              to add their own dishes to this table.
            </p>
          )}
        </header>

        {/* Closed banner */}
        {isClosed && (
          <div className="shared-order__closed-banner" role="status">
            <strong>Collection is closed.</strong>
            <span>
              {isOrganizer
                ? 'You can reopen it from the toolbar above.'
                : 'Ask the organizer to reopen if you need to make changes.'}
            </span>
          </div>
        )}

        <div className="shared-order__layout">
          {/* Main: participants */}
          <div className="shared-order__main">
            <h2 className="shared-order__section-title">
              Participants · {sharedOrder.participants.length}
            </h2>

            <ul className="shared-order__participants">
              {sharedOrder.participants.map((p) => {
                const subtotal = p.items.reduce(
                  (s, it) => s + parsePrice(it.price) * it.quantity,
                  0
                )
                const isMe = me && p.id === me.id
                const canEdit = isMe && !isClosed
                return (
                  <li
                    key={p.id}
                    className={`shared-order__participant ${
                      isMe ? 'shared-order__participant--me' : ''
                    }`}
                  >
                    <div className="shared-order__participant-header">
                      <div>
                        <p className="shared-order__participant-name">
                          {p.name}
                          {p.isOrganizer && (
                            <span className="shared-order__organizer-tag">
                              Organizer
                            </span>
                          )}
                          {isMe && (
                            <span className="shared-order__you-tag">You</span>
                          )}
                        </p>
                        <p className="shared-order__participant-meta">
                          {p.items.length === 0
                            ? 'No items yet'
                            : `${p.items.reduce((s, it) => s + it.quantity, 0)} item${
                                p.items.reduce((s, it) => s + it.quantity, 0) === 1 ? '' : 's'
                              }`}
                        </p>
                      </div>
                      <p className="shared-order__participant-subtotal">
                        {formatPrice(subtotal)}
                      </p>
                    </div>

                    {p.items.length > 0 && (
                      <ul className="shared-order__items">
                        {p.items.map((it) => {
                          const lineTotal = parsePrice(it.price) * it.quantity
                          return (
                            <li key={it.id} className="shared-order__item">
                              <div className="shared-order__item-info">
                                <span className="shared-order__item-qty">
                                  {it.quantity}×
                                </span>
                                <span className="shared-order__item-name">
                                  {it.name}
                                </span>
                                <span className="shared-order__item-price">
                                  {it.price}
                                </span>
                              </div>
                              <div className="shared-order__item-right">
                                <span className="shared-order__item-total">
                                  {formatPrice(lineTotal)}
                                </span>
                                {canEdit && (
                                  <div className="shared-order__item-controls">
                                    <button
                                      type="button"
                                      className="shared-order__qty-btn"
                                      onClick={() =>
                                        updateItemQuantity(
                                          bookingId,
                                          p.id,
                                          it.id,
                                          it.quantity - 1
                                        )
                                      }
                                      aria-label={`Decrease ${it.name}`}
                                    >
                                      −
                                    </button>
                                    <span className="shared-order__qty-value">
                                      {it.quantity}
                                    </span>
                                    <button
                                      type="button"
                                      className="shared-order__qty-btn"
                                      onClick={() =>
                                        updateItemQuantity(
                                          bookingId,
                                          p.id,
                                          it.id,
                                          it.quantity + 1
                                        )
                                      }
                                      aria-label={`Increase ${it.name}`}
                                    >
                                      +
                                    </button>
                                    <button
                                      type="button"
                                      className="shared-order__remove-btn"
                                      onClick={() =>
                                        removeItem(bookingId, p.id, it.id)
                                      }
                                      aria-label={`Remove ${it.name}`}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                )}
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    )}

                    {canEdit && (
                      <button
                        type="button"
                        className="shared-order__add-items-btn"
                        onClick={() => setShowMenu(true)}
                      >
                        + Add items to my order
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>

            {!isOrganizer && (
              <p className="shared-order__guest-note">
                You're viewing as <strong>{me?.name}</strong>.{' '}
                <Link
                  to="/account"
                  className="shared-order__inline-link"
                >
                  Back to account
                </Link>
              </p>
            )}
          </div>

          {/* Sidebar */}
          <aside className="shared-order__sidebar">
            <div className="shared-order__total-card">
              <h2 className="shared-order__total-title">Group total</h2>
              <p className="shared-order__total-value" aria-live="polite">
                {formatPrice(grandTotal)}
              </p>
              <p className="shared-order__total-meta">
                {sharedOrder.participants.length} participant
                {sharedOrder.participants.length === 1 ? '' : 's'} ·{' '}
                {sharedOrder.participants.reduce(
                  (s, p) => s + p.items.reduce((ss, it) => ss + it.quantity, 0),
                  0
                )} item
                {sharedOrder.participants.reduce(
                  (s, p) => s + p.items.reduce((ss, it) => ss + it.quantity, 0),
                  0
                ) === 1 ? '' : 's'}
              </p>

              <dl className="shared-order__breakdown">
                {sharedOrder.participants.map((p) => {
                  const subtotal = p.items.reduce(
                    (s, it) => s + parsePrice(it.price) * it.quantity,
                    0
                  )
                  return (
                    <div key={p.id} className="shared-order__breakdown-row">
                      <dt>{p.name}</dt>
                      <dd>{formatPrice(subtotal)}</dd>
                    </div>
                  )
                })}
              </dl>

              <p className="shared-order__sidebar-note">
                {isClosed
                  ? 'Collection is closed. Total is final for this demo.'
                  : 'Total updates live as participants add items.'}
              </p>
            </div>

            {isOrganizer && (
              <Link
                to={`/account/bookings/${bookingId}`}
                className="shared-order__back-link"
              >
                ← Back to booking
              </Link>
            )}
          </aside>
        </div>

        {/* Menu modal */}
        {showMenu && me && (
          <SharedOrderMenu
            bookingId={bookingId}
            participantId={me.id}
            onAdd={addItem}
            onClose={() => setShowMenu(false)}
          />
        )}
      </div>
    </div>
  )
}

/* --- Menu modal --- */

function SharedOrderMenu({ bookingId, participantId, onAdd, onClose }) {
  const [activeCategory, setActiveCategory] = useState('khachapuri')

  const allCategories = [...FOOD_CATEGORIES, ...BAR_CATEGORIES]
  const isDrinks = activeCategory === 'drinks'
  const activeCategoryData = isDrinks
    ? null
    : allCategories.find((c) => c.id === activeCategory)

  return (
    <div
      className="shared-order-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Add items to your order"
    >
      <div
        className="shared-order-menu__backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="shared-order-menu__panel">
        <header className="shared-order-menu__header">
          <h2 className="shared-order-menu__title">Add items to your order</h2>
          <button
            type="button"
            className="shared-order-menu__close"
            onClick={onClose}
            aria-label="Close menu"
          >
            ×
          </button>
        </header>

        <nav className="shared-order-menu__nav" aria-label="Menu categories">
          <ul className="shared-order-menu__nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.id} className="shared-order-menu__nav-item">
                <button
                  type="button"
                  className={`shared-order-menu__nav-link ${
                    activeCategory === item.id ? 'shared-order-menu__nav-link--active' : ''
                  }`}
                  onClick={() => setActiveCategory(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="shared-order-menu__content">
          {activeCategoryData && !isDrinks && (
            <section className="shared-order-menu__category">
              <h3 className="shared-order-menu__category-title">
                {activeCategoryData.title}
              </h3>
              <ul className="shared-order-menu__items">
                {activeCategoryData.items.map((item) => (
                  <MenuCard
                    key={item.name}
                    item={item}
                    onAdd={(it) => onAdd(bookingId, participantId, it)}
                    buttonLabel="Add to my order"
                  />
                ))}
              </ul>
            </section>
          )}

          {isDrinks && (
            <>
              {BAR_CATEGORIES.map((category) => (
                <section
                  key={category.id}
                  className="shared-order-menu__category"
                >
                  <h3 className="shared-order-menu__category-title">
                    {category.title}
                  </h3>
                  <ul className="shared-order-menu__items">
                    {category.items.map((item) => (
                      <MenuCard
                        key={item.name}
                        item={item}
                        onAdd={(it) => onAdd(bookingId, participantId, it)}
                        buttonLabel="Add to my order"
                      />
                    ))}
                  </ul>
                </section>
              ))}
            </>
          )}
        </div>

        <footer className="shared-order-menu__footer">
          <button
            type="button"
            className="shared-order__primary-btn"
            onClick={onClose}
          >
            Done
          </button>
        </footer>
      </div>
    </div>
  )
}

export default SharedOrder