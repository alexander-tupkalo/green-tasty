import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePreorder } from '../context/PreorderContext.jsx'
import { useReservations } from '../context/ReservationsContext.jsx'
import { useSharedOrder } from '../context/SharedOrderContext.jsx'
import './Confirmation.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

function parsePrice(str) {
  return parseFloat(String(str).replace(/[^0-9.]/g, '')) || 0
}

const EMPTY_CONTACT = {
  fullName: '',
  email: '',
  phone: '',
}

function Confirmation() {
  const { booking, items, subtotal, clearPreorder } = usePreorder()
  const { addBooking } = useReservations()
  const { startSharedOrder } = useSharedOrder()
  const navigate = useNavigate()

  const [contact, setContact] = useState(EMPTY_CONTACT)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('review') // 'review' | 'submitting' | 'success'
  const [confirmedBooking, setConfirmedBooking] = useState(null)
  const [linkCopied, setLinkCopied] = useState(false)

  const preorderTotal = useMemo(() => subtotal, [subtotal])

  const handleChange = (e) => {
    const { name, value } = e.target
    setContact((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validate = () => {
    const next = {}
    if (!contact.fullName.trim()) {
      next.fullName = 'Full name is required.'
    } else if (contact.fullName.trim().length < 2) {
      next.fullName = 'Please enter your full name.'
    }
    if (!contact.email.trim()) {
      next.email = 'Email is required.'
    } else if (!EMAIL_REGEX.test(contact.email.trim())) {
      next.email = 'Please enter a valid email address.'
    }
    if (!contact.phone.trim()) {
      next.phone = 'Phone number is required.'
    } else if (contact.phone.replace(/\D/g, '').length < 6) {
      next.phone = 'Please enter a valid phone number.'
    }
    return next
  }

  const handleConfirm = (e) => {
    if (e) e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setStatus('submitting')

    setTimeout(() => {
      const newBooking = addBooking({
        restaurant: booking.restaurant,
        date: booking.date,
        time: booking.time,
        guests: booking.guests,
        tableId: booking.tableId,
        items: items,
        contact: {
          fullName: contact.fullName.trim(),
          email: contact.email.trim(),
          phone: contact.phone.trim(),
        },
      })

      // Auto-create a shared order for this booking so the
      // organizer can immediately share the link with friends.
      startSharedOrder(newBooking)

      setConfirmedBooking(newBooking)
      clearPreorder()
      setStatus('success')
    }, 800)
  }

  const handleCopyLink = () => {
    if (!confirmedBooking) return
    const url = `${window.location.origin}/account/bookings/${confirmedBooking.id}/shared`
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

  // --- No booking state — user landed here directly ---
  if (!booking && status !== 'success') {
    return (
      <div className="confirmation-page">
        <div className="confirmation-page__inner">
          <div className="confirmation__no-booking">
            <h1 className="confirmation__no-booking-title">
              No table selected
            </h1>
            <p className="confirmation__no-booking-text">
              You need to pick a table first. Head back to the
              reservation page, search for an available table, and
              choose a time slot.
            </p>
            <Link to="/reservations" className="confirmation__no-booking-cta">
              Find a table
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // --- Success state ---
  if (status === 'success' && confirmedBooking) {
    return (
      <div className="confirmation-page">
        <div className="confirmation-page__inner">
          <div className="confirmation__success">
            <div className="confirmation__success-icon" aria-hidden="true">
              <svg viewBox="0 0 52 52" className="confirmation__success-check">
                <circle cx="26" cy="26" r="25" fill="none" stroke="currentColor" strokeWidth="2" />
                <path fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M14 27l8 8 16-18" />
              </svg>
            </div>
            <p className="confirmation__success-eyebrow">
              RESERVATION CONFIRMED (DEMO)
            </p>
            <h1 className="confirmation__success-title">
              Your table is booked.
            </h1>
            <p className="confirmation__success-lead">
              Booking reference <strong>{confirmedBooking.id}</strong>.
              This is a demo confirmation — no real reservation has
              been made. You can view this booking in your account.
            </p>

            <div className="confirmation__success-summary">
              <dl className="confirmation__success-details">
                <div className="confirmation__success-row">
                  <dt>Restaurant</dt>
                  <dd>{confirmedBooking.restaurant.name}</dd>
                </div>
                <div className="confirmation__success-row">
                  <dt>Address</dt>
                  <dd>{confirmedBooking.restaurant.address}</dd>
                </div>
                <div className="confirmation__success-row">
                  <dt>Date</dt>
                  <dd>{formatDate(confirmedBooking.date)}</dd>
                </div>
                <div className="confirmation__success-row">
                  <dt>Time</dt>
                  <dd>{confirmedBooking.time}</dd>
                </div>
                <div className="confirmation__success-row">
                  <dt>Guests</dt>
                  <dd>
                    {confirmedBooking.guests}{' '}
                    {confirmedBooking.guests === 1 ? 'guest' : 'guests'}
                  </dd>
                </div>
                {confirmedBooking.items.length > 0 && (
                  <div className="confirmation__success-row">
                    <dt>Pre-order</dt>
                    <dd>
                      {confirmedBooking.items.length} item
                      {confirmedBooking.items.length === 1 ? '' : 's'} ·{' '}
                      {formatPrice(
                        confirmedBooking.items.reduce(
                          (sum, it) => sum + parsePrice(it.price) * it.quantity,
                          0
                        )
                      )}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Shared order invite */}
            <div className="confirmation__shared-invite">
              <p className="confirmation__shared-invite-title">
                Invite friends to add their dishes
              </p>
              <p className="confirmation__shared-invite-text">
                Share this link — friends can add their own food and
                drinks to your table.
              </p>
              <button
                type="button"
                className="confirmation__shared-invite-btn"
                onClick={handleCopyLink}
              >
                {linkCopied ? 'Link copied ✓' : 'Copy invite link'}
              </button>
              {linkCopied && (
                <p className="confirmation__shared-invite-note">
                  Send this link to your friends. They'll be able to
                  add their dishes and see the group total.
                </p>
              )}
              <Link
                to={`/account/bookings/${confirmedBooking.id}/shared`}
                className="confirmation__shared-invite-view"
              >
                Open shared order →
              </Link>
            </div>

            <div className="confirmation__success-actions">
              <Link to="/account" className="confirmation__success-primary">
                View in My Reservations
              </Link>
              <Link to="/reservations" className="confirmation__success-secondary">
                Book another table
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- Review state (form) ---
  return (
    <div className="confirmation-page">
      <div className="confirmation-page__inner">
        <div className="confirmation__layout">
          {/* Review side */}
          <div className="confirmation__review-side">
            <header className="confirmation__header">
              <p className="confirmation__eyebrow">CONFIRM YOUR BOOKING</p>
              <h1 className="confirmation__title">Almost there.</h1>
              <p className="confirmation__lead">
                Review your table and pre-order, add your contact
                details, and confirm the reservation.
              </p>
              <p className="confirmation__badge">
                DEMO · NO REAL RESERVATION IS MADE
              </p>
            </header>

            {/* Booking details */}
            <section className="confirmation__card">
              <h2 className="confirmation__card-title">Your table</h2>
              <p className="confirmation__restaurant">
                {booking.restaurant.name}
              </p>
              <p className="confirmation__address">
                {booking.restaurant.address}
              </p>
              <dl className="confirmation__details">
                <div className="confirmation__detail-row">
                  <dt>Date</dt>
                  <dd>{formatDate(booking.date)}</dd>
                </div>
                <div className="confirmation__detail-row">
                  <dt>Time</dt>
                  <dd>{booking.time}</dd>
                </div>
                <div className="confirmation__detail-row">
                  <dt>Guests</dt>
                  <dd>
                    {booking.guests}{' '}
                    {booking.guests === 1 ? 'guest' : 'guests'}
                  </dd>
                </div>
                <div className="confirmation__detail-row">
                  <dt>Table</dt>
                  <dd>{booking.tableId}</dd>
                </div>
              </dl>
              <Link to="/reservations/preorder" className="confirmation__edit-link">
                ← Edit table or pre-order
              </Link>
            </section>

            {/* Pre-order review */}
            <section className="confirmation__card">
              <div className="confirmation__card-header">
                <h2 className="confirmation__card-title">Pre-order</h2>
                {items.length > 0 && (
                  <span className="confirmation__card-meta">
                    {items.length} item{items.length === 1 ? '' : 's'} ·{' '}
                    {formatPrice(preorderTotal)}
                  </span>
                )}
              </div>

              {items.length === 0 ? (
                <p className="confirmation__empty-preorder">
                  No pre-order added. You can add dishes on the
                  previous step, or skip and just reserve the table.
                </p>
              ) : (
                <ul className="confirmation__preorder-list">
                  {items.map((item) => {
                    const lineTotal = parsePrice(item.price) * item.quantity
                    return (
                      <li key={item.id} className="confirmation__preorder-item">
                        <span className="confirmation__preorder-qty">
                          {item.quantity}×
                        </span>
                        <span className="confirmation__preorder-name">
                          {item.name}
                        </span>
                        <span className="confirmation__preorder-total">
                          {formatPrice(lineTotal)}
                        </span>
                      </li>
                    )
                  })}
                  <li className="confirmation__preorder-total-row">
                    <span>Pre-order total</span>
                    <span>{formatPrice(preorderTotal)}</span>
                  </li>
                </ul>
              )}
            </section>

            {/* Contact form */}
            <form
              className="confirmation__form"
              onSubmit={handleConfirm}
              noValidate
            >
              <h2 className="confirmation__card-title">Contact details</h2>

              <div className="confirmation__field">
                <label htmlFor="fullName" className="confirmation__label">
                  Full name <span className="confirmation__required">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Nino Gelashvili"
                  className={`confirmation__input ${
                    errors.fullName ? 'confirmation__input--error' : ''
                  }`}
                  value={contact.fullName}
                  onChange={handleChange}
                  aria-invalid={errors.fullName ? 'true' : 'false'}
                  aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                  required
                />
                {errors.fullName && (
                  <p id="fullName-error" className="confirmation__error">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="confirmation__field-row">
                <div className="confirmation__field">
                  <label htmlFor="email" className="confirmation__label">
                    Email <span className="confirmation__required">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="e.g. name@example.com"
                    className={`confirmation__input ${
                      errors.email ? 'confirmation__input--error' : ''
                    }`}
                    value={contact.email}
                    onChange={handleChange}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    required
                  />
                  {errors.email && (
                    <p id="email-error" className="confirmation__error">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="confirmation__field">
                  <label htmlFor="phone" className="confirmation__label">
                    Phone <span className="confirmation__required">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="e.g. +995 599 12 34 56"
                    className={`confirmation__input ${
                      errors.phone ? 'confirmation__input--error' : ''
                    }`}
                    value={contact.phone}
                    onChange={handleChange}
                    aria-invalid={errors.phone ? 'true' : 'false'}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    required
                  />
                  {errors.phone && (
                    <p id="phone-error" className="confirmation__error">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Summary side (sticky) */}
          <aside className="confirmation__summary" aria-label="Booking summary">
            <h2 className="confirmation__summary-title">Summary</h2>

            <dl className="confirmation__summary-rows">
              <div className="confirmation__summary-row">
                <dt>Restaurant</dt>
                <dd>{booking.restaurant.name}</dd>
              </div>
              <div className="confirmation__summary-row">
                <dt>Date & time</dt>
                <dd>
                  {formatDate(booking.date)} · {booking.time}
                </dd>
              </div>
              <div className="confirmation__summary-row">
                <dt>Guests</dt>
                <dd>
                  {booking.guests}{' '}
                  {booking.guests === 1 ? 'guest' : 'guests'}
                </dd>
              </div>
              <div className="confirmation__summary-row">
                <dt>Table</dt>
                <dd>{booking.tableId}</dd>
              </div>
              <div className="confirmation__summary-row">
                <dt>Pre-order items</dt>
                <dd>{items.length}</dd>
              </div>
              {items.length > 0 && (
                <div className="confirmation__summary-row confirmation__summary-row--total">
                  <dt>Pre-order total</dt>
                  <dd>{formatPrice(preorderTotal)}</dd>
                </div>
              )}
            </dl>

            <p className="confirmation__summary-note">
              {items.length === 0
                ? 'You are reserving the table only. You can add a pre-order later.'
                : 'Taxes and service fees, if any, will be calculated at the restaurant.'}
            </p>

            <button
              type="button"
              className="confirmation__submit"
              onClick={handleConfirm}
              disabled={status === 'submitting'}
              aria-busy={status === 'submitting'}
            >
              {status === 'submitting' ? 'Please wait…' : 'Confirm reservation'}
            </button>

            <Link
              to="/reservations/preorder"
              className="confirmation__back-link"
            >
              ← Back to pre-order
            </Link>

            <p className="confirmation__disclaimer">
              DEMO · No real reservation is created. Booking data is
              stored only for this browser session.
            </p>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Confirmation