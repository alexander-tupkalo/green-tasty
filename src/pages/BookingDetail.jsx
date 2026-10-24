import { Link, useParams, useNavigate } from 'react-router-dom'
import { useReservations } from '../context/ReservationsContext.jsx'
import { useSharedOrder } from '../context/SharedOrderContext.jsx'
import './BookingDetail.css'

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

function BookingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getBookingById, cancelBooking } = useReservations()
  const { getSharedOrder } = useSharedOrder()

  const booking = getBookingById(id)
  const sharedOrder = getSharedOrder(id)

  // --- Not-found state ---
  if (!booking) {
    return (
      <div className="booking-detail">
        <div className="booking-detail__inner">
          <div className="booking-detail__not-found">
            <p className="booking-detail__not-found-code">404</p>
            <h1 className="booking-detail__not-found-title">
              Booking not found
            </h1>
            <p className="booking-detail__not-found-lead">
              We could not find a booking with reference <strong>{id}</strong>.
              It may have been removed, or the link may be incorrect.
            </p>
            <Link to="/account" className="booking-detail__not-found-link">
              Back to My Reservations
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isUpcoming = booking.status === 'upcoming'

  const handleCancel = () => {
    const ok = window.confirm(
      `Cancel reservation ${booking.id}?\n\nThis cannot be undone in this demo session.`
    )
    if (ok) {
      cancelBooking(booking.id)
      navigate('/account')
    }
  }

  const preorderTotal = booking.items.reduce(
    (sum, it) => sum + parsePrice(it.price) * it.quantity,
    0
  )

  return (
    <div className="booking-detail">
      <div className="booking-detail__inner">
        {/* Breadcrumb */}
        <nav className="booking-detail__breadcrumb" aria-label="Breadcrumb">
          <Link to="/account" className="booking-detail__breadcrumb-link">
            Account
          </Link>
          <span className="booking-detail__breadcrumb-sep">/</span>
          <Link to="/account" className="booking-detail__breadcrumb-link">
            My Reservations
          </Link>
          <span className="booking-detail__breadcrumb-sep">/</span>
          <span className="booking-detail__breadcrumb-current">
            {booking.id}
          </span>
        </nav>

        {/* Header */}
        <header className="booking-detail__header">
          <div className="booking-detail__header-main">
            <p className="booking-detail__eyebrow">BOOKING REFERENCE</p>
            <h1 className="booking-detail__id">{booking.id}</h1>
          </div>
          <span
            className={`booking-detail__status booking-detail__status--${booking.status}`}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </header>

        <div className="booking-detail__layout">
          {/* Main column */}
          <div className="booking-detail__main">
            {/* Restaurant card */}
            <section className="booking-detail__card">
              <div className="booking-detail__restaurant-image-wrap">
                <img
                  src={booking.restaurant.image}
                  alt={booking.restaurant.imageAlt}
                  className="booking-detail__restaurant-image"
                />
              </div>

              <div className="booking-detail__card-body">
                <h2 className="booking-detail__restaurant-name">
                  {booking.restaurant.name}
                </h2>
                <p className="booking-detail__restaurant-address">
                  {booking.restaurant.address}
                </p>

                <dl className="booking-detail__grid">
                  <div className="booking-detail__field">
                    <dt>Date</dt>
                    <dd>{formatDate(booking.date)}</dd>
                  </div>
                  <div className="booking-detail__field">
                    <dt>Time</dt>
                    <dd>{booking.time}</dd>
                  </div>
                  <div className="booking-detail__field">
                    <dt>Guests</dt>
                    <dd>
                      {booking.guests}{' '}
                      {booking.guests === 1 ? 'guest' : 'guests'}
                    </dd>
                  </div>
                  <div className="booking-detail__field">
                    <dt>Table</dt>
                    <dd>{booking.tableId}</dd>
                  </div>
                </dl>
              </div>
            </section>

            {/* Pre-order card */}
            <section className="booking-detail__card">
              <div className="booking-detail__card-header">
                <h2 className="booking-detail__card-title">Pre-order</h2>
                {booking.items.length > 0 && (
                  <span className="booking-detail__card-meta">
                    {booking.items.reduce((s, it) => s + it.quantity, 0)} items
                    · {formatPrice(preorderTotal)}
                  </span>
                )}
              </div>

              {booking.items.length === 0 ? (
                <p className="booking-detail__empty">
                  No pre-order added for this booking.
                </p>
              ) : (
                <ul className="booking-detail__preorder-list">
                  {booking.items.map((item) => {
                    const lineTotal = parsePrice(item.price) * item.quantity
                    return (
                      <li
                        key={item.id}
                        className="booking-detail__preorder-item"
                      >
                        <span className="booking-detail__preorder-qty">
                          {item.quantity}×
                        </span>
                        <span className="booking-detail__preorder-name">
                          {item.name}
                        </span>
                        <span className="booking-detail__preorder-price">
                          {item.price}
                        </span>
                        <span className="booking-detail__preorder-total">
                          {formatPrice(lineTotal)}
                        </span>
                      </li>
                    )
                  })}
                  <li className="booking-detail__preorder-subtotal">
                    <span>Pre-order total</span>
                    <span>{formatPrice(preorderTotal)}</span>
                  </li>
                </ul>
              )}
            </section>

            {/* Shared order card — упрощённая */}
            {isUpcoming && sharedOrder && (
              <section className="booking-detail__card booking-detail__shared-card">
                <div className="booking-detail__card-header">
                  <h2 className="booking-detail__card-title">Shared order</h2>
                  <span
                    className={`booking-detail__shared-status booking-detail__shared-status--${sharedOrder.status}`}
                  >
                    {sharedOrder.status === 'closed' ? 'Closed' : 'Open'}
                  </span>
                </div>

                <div className="booking-detail__shared-content">
                  <p className="booking-detail__shared-text">
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
                  <p className="booking-detail__shared-subtext">
                    Friends can add their own dishes and drinks to
                    your table using the invite link.
                  </p>
                  <Link
                    to={`/account/bookings/${booking.id}/shared`}
                    className="booking-detail__shared-cta"
                  >
                    {sharedOrder.status === 'closed'
                      ? 'View shared order →'
                      : 'Open shared order →'}
                  </Link>
                </div>
              </section>
            )}

            {/* Contact card */}
            <section className="booking-detail__card">
              <h2 className="booking-detail__card-title">Contact details</h2>
              <dl className="booking-detail__contact-grid">
                <div className="booking-detail__contact-field">
                  <dt>Full name</dt>
                  <dd>{booking.contact.fullName}</dd>
                </div>
                <div className="booking-detail__contact-field">
                  <dt>Email</dt>
                  <dd>{booking.contact.email}</dd>
                </div>
                <div className="booking-detail__contact-field">
                  <dt>Phone</dt>
                  <dd>{booking.contact.phone}</dd>
                </div>
              </dl>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="booking-detail__aside">
            <div className="booking-detail__summary">
              <h2 className="booking-detail__summary-title">Summary</h2>

              <dl className="booking-detail__summary-rows">
                <div className="booking-detail__summary-row">
                  <dt>Restaurant</dt>
                  <dd>{booking.restaurant.name}</dd>
                </div>
                <div className="booking-detail__summary-row">
                  <dt>Date & time</dt>
                  <dd>{formatDate(booking.date)} · {booking.time}</dd>
                </div>
                <div className="booking-detail__summary-row">
                  <dt>Guests</dt>
                  <dd>{booking.guests}</dd>
                </div>
                <div className="booking-detail__summary-row">
                  <dt>Table</dt>
                  <dd>{booking.tableId}</dd>
                </div>
                <div className="booking-detail__summary-row">
                  <dt>Status</dt>
                  <dd className="booking-detail__summary-status">
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </dd>
                </div>
                <div className="booking-detail__summary-row">
                  <dt>Booked on</dt>
                  <dd>{formatDate(booking.createdAt.slice(0, 10))}</dd>
                </div>
                {booking.items.length > 0 && (
                  <div className="booking-detail__summary-row booking-detail__summary-row--total">
                    <dt>Pre-order total</dt>
                    <dd>{formatPrice(preorderTotal)}</dd>
                  </div>
                )}
              </dl>

              {isUpcoming ? (
                <>
                  <button
                    type="button"
                    className="booking-detail__cancel-btn"
                    onClick={handleCancel}
                  >
                    Cancel reservation
                  </button>
                  <p className="booking-detail__cancel-note">
                    Demo only — cancellation does not notify the restaurant.
                  </p>
                </>
              ) : (
                <p className="booking-detail__past-note">
                  This booking is no longer active and cannot be cancelled.
                </p>
              )}

              <Link
                to="/reservations"
                className="booking-detail__book-another"
              >
                Book another table
              </Link>
            </div>
          </aside>
        </div>

        <div className="booking-detail__back-footer">
          <Link to="/account" className="booking-detail__back-link">
            ← Back to My Reservations
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BookingDetail