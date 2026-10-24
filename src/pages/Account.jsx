import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useReservations } from '../context/ReservationsContext.jsx'
import './Account.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const DEMO_USER = {
  fullName: 'Nino Gelashvili',
  email: 'nino.gelashvili@example.com',
  phone: '+995 599 12 34 56',
}

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'reservations', label: 'Reservations' },
  { id: 'profile', label: 'Profile' },
  { id: 'settings', label: 'Settings' },
]

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function Account() {
  const { bookings, upcomingBookings } = useReservations()

  const [user, setUser] = useState(DEMO_USER)
  const [activeTab, setActiveTab] = useState('overview')

  // Profile form state
  const [profileForm, setProfileForm] = useState(DEMO_USER)
  const [profileErrors, setProfileErrors] = useState({})
  const [profileSaved, setProfileSaved] = useState(false)

  // Settings state
  const [contactPrefs, setContactPrefs] = useState({
    emailUpdates: true,
    smsReminders: true,
    pushNotifications: false,
    marketingOffers: false,
  })
  const [language, setLanguage] = useState('en')
  const [settingsSaved, setSettingsSaved] = useState(false)

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
    if (profileErrors[name]) {
      setProfileErrors((prev) => ({ ...prev, [name]: undefined }))
    }
    if (profileSaved) setProfileSaved(false)
  }

  const validateProfile = () => {
    const next = {}
    if (!profileForm.fullName.trim()) {
      next.fullName = 'Full name is required.'
    } else if (profileForm.fullName.trim().length < 2) {
      next.fullName = 'Please enter your full name.'
    }
    if (!profileForm.email.trim()) {
      next.email = 'Email is required.'
    } else if (!EMAIL_REGEX.test(profileForm.email.trim())) {
      next.email = 'Please enter a valid email address.'
    }
    if (!profileForm.phone.trim()) {
      next.phone = 'Phone number is required.'
    } else if (profileForm.phone.replace(/\D/g, '').length < 6) {
      next.phone = 'Please enter a valid phone number.'
    }
    return next
  }

  const handleProfileSubmit = (e) => {
    e.preventDefault()
    const next = validateProfile()
    setProfileErrors(next)
    if (Object.keys(next).length > 0) return
    setUser({
      fullName: profileForm.fullName.trim(),
      email: profileForm.email.trim(),
      phone: profileForm.phone.trim(),
    })
    setProfileSaved(true)
  }

  const handleContactPrefChange = (e) => {
    const { name, checked } = e.target
    setContactPrefs((prev) => ({ ...prev, [name]: checked }))
    if (settingsSaved) setSettingsSaved(false)
  }

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value)
    if (settingsSaved) setSettingsSaved(false)
  }

  const handleSettingsSubmit = (e) => {
    e.preventDefault()
    setSettingsSaved(true)
  }

  const upcomingCount = upcomingBookings.length
  const completedVisitsCount = bookings.filter(
    (b) => b.status === 'completed'
  ).length
  const totalPreordersCount = bookings.filter(
    (b) => b.items.length > 0
  ).length

  const pastBookings = bookings.filter((b) => b.status !== 'upcoming')

  const nextReservation = upcomingBookings[0] || null

  return (
    <div className="account">
      <div className="account__inner">
        {/* Sidebar */}
        <aside className="account__sidebar">
          <div className="account__user">
            <p className="account__user-name">{user.fullName}</p>
            <p className="account__user-email">{user.email}</p>
            <span className="account__demo-badge">Demo account</span>
          </div>

          <nav className="account__nav" aria-label="Account sections">
            <ul className="account__nav-list">
              {TABS.map((tab) => (
                <li key={tab.id} className="account__nav-item">
                  <button
                    type="button"
                    className={`account__nav-link ${
                      activeTab === tab.id ? 'account__nav-link--active' : ''
                    }`}
                    aria-pressed={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="account__sidebar-footer">
            <Link to="/restaurants" className="account__sidebar-link">
              ← Back to restaurants
            </Link>
          </div>
        </aside>

        {/* Content */}
        <main className="account__content">
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <section className="account__section" aria-labelledby="overview-heading">
              <header className="account__section-header">
                <h1 id="overview-heading" className="account__title">
                  Welcome back, {user.fullName.split(' ')[0]}.
                </h1>
                <p className="account__lead">
                  Here is a quick overview of your account. Reservations
                  you create in the booking flow appear here in real
                  time.
                </p>
              </header>

              <div className="account__stats">
                <div className="stat-card">
                  <p className="stat-card__value">{upcomingCount}</p>
                  <p className="stat-card__label">Upcoming reservations</p>
                </div>
                <div className="stat-card">
                  <p className="stat-card__value">{completedVisitsCount}</p>
                  <p className="stat-card__label">Completed visits</p>
                </div>
                <div className="stat-card">
                  <p className="stat-card__value">{totalPreordersCount}</p>
                  <p className="stat-card__label">With pre-orders</p>
                </div>
              </div>

              {nextReservation ? (
                <section className="next-reservation">
                  <p className="next-reservation__eyebrow">
                    NEXT RESERVATION
                  </p>
                  <h2 className="next-reservation__title">
                    {nextReservation.restaurant.name}
                  </h2>
                  <dl className="next-reservation__details">
                    <div className="next-reservation__row">
                      <dt>Address</dt>
                      <dd>{nextReservation.restaurant.address}</dd>
                    </div>
                    <div className="next-reservation__row">
                      <dt>Date</dt>
                      <dd>{formatDate(nextReservation.date)}</dd>
                    </div>
                    <div className="next-reservation__row">
                      <dt>Time</dt>
                      <dd>{nextReservation.time}</dd>
                    </div>
                    <div className="next-reservation__row">
                      <dt>Guests</dt>
                      <dd>{nextReservation.guests}</dd>
                    </div>
                    {nextReservation.items.length > 0 && (
                      <div className="next-reservation__row">
                        <dt>Pre-order</dt>
                        <dd>
                          {nextReservation.items.length} item
                          {nextReservation.items.length === 1 ? '' : 's'}
                        </dd>
                      </div>
                    )}
                  </dl>
                  <div className="next-reservation__footer">
                    <span className="status-badge status-badge--upcoming">
                      Upcoming
                    </span>
                    <span className="next-reservation__ref">
                      Ref: {nextReservation.id}
                    </span>
                  </div>
                  <div className="next-reservation__cta">
                    <Link
                      to={`/account/bookings/${nextReservation.id}`}
                      className="next-reservation__link"
                    >
                      View booking details →
                    </Link>
                  </div>
                </section>
              ) : (
                <div className="account__empty-inline-card">
                  <p className="account__empty-inline-title">
                    No upcoming reservations
                  </p>
                  <p className="account__empty-inline-text">
                    Book a table and it will appear here.
                  </p>
                  <Link to="/reservations" className="account__empty-inline-cta">
                    Book a table
                  </Link>
                </div>
              )}
            </section>
          )}

          {/* RESERVATIONS */}
          {activeTab === 'reservations' && (
            <section className="account__section" aria-labelledby="reservations-heading">
              <header className="account__section-header">
                <h1 id="reservations-heading" className="account__title">
                  My Reservations
                </h1>
                <p className="account__lead">
                  Reservations you create in the booking flow appear
                  here. Click a card to see full details, pre-order
                  items, and contact information.
                </p>
              </header>

              {bookings.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-state__title">No reservations yet</p>
                  <p className="empty-state__text">
                    When you book a table through the reservation
                    flow, your bookings will appear here.
                  </p>
                  <Link to="/reservations" className="empty-state__cta">
                    Book a table
                  </Link>
                </div>
              ) : (
                <div className="reservations-block">
                  {/* Upcoming */}
                  {upcomingBookings.length > 0 && (
                    <div className="reservations-block__group">
                      <h2 className="reservations-block__group-title">
                        Upcoming · {upcomingBookings.length}
                      </h2>
                      <ul className="data-list">
                        {upcomingBookings.map((r) => (
                          <BookingCard key={r.id} booking={r} />
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Past */}
                  {pastBookings.length > 0 && (
                    <div className="reservations-block__group">
                      <h2 className="reservations-block__group-title">
                        Past · {pastBookings.length}
                      </h2>
                      <ul className="data-list">
                        {pastBookings.map((r) => (
                          <BookingCard key={r.id} booking={r} />
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* PROFILE */}
          {activeTab === 'profile' && (
            <section className="account__section" aria-labelledby="profile-heading">
              <header className="account__section-header">
                <h1 id="profile-heading" className="account__title">
                  Profile
                </h1>
                <p className="account__lead">
                  Update your contact details. Changes are saved to
                  this session only — demo mode.
                </p>
              </header>

              <div className="profile">
                <div className="profile__current">
                  <p className="profile__current-label">Current details</p>
                  <p className="profile__current-name">{user.fullName}</p>
                  <p className="profile__current-line">{user.email}</p>
                  <p className="profile__current-line">{user.phone}</p>
                </div>

                <form className="profile__form" onSubmit={handleProfileSubmit} noValidate>
                  {profileSaved && (
                    <div className="profile__notice" role="status">
                      Saved for this session only — demo mode. Changes
                      are not permanently stored.
                    </div>
                  )}

                  <div className="profile__field">
                    <label htmlFor="fullName" className="profile__label">
                      Full name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      className={`profile__input ${
                        profileErrors.fullName ? 'profile__input--error' : ''
                      }`}
                      value={profileForm.fullName}
                      onChange={handleProfileChange}
                      aria-invalid={profileErrors.fullName ? 'true' : 'false'}
                      aria-describedby={
                        profileErrors.fullName ? 'fullName-error' : undefined
                      }
                    />
                    {profileErrors.fullName && (
                      <p id="fullName-error" className="profile__error">
                        {profileErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="profile__field">
                    <label htmlFor="email" className="profile__label">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={`profile__input ${
                        profileErrors.email ? 'profile__input--error' : ''
                      }`}
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      aria-invalid={profileErrors.email ? 'true' : 'false'}
                      aria-describedby={
                        profileErrors.email ? 'email-error' : undefined
                      }
                    />
                    {profileErrors.email && (
                      <p id="email-error" className="profile__error">
                        {profileErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="profile__field">
                    <label htmlFor="phone" className="profile__label">
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className={`profile__input ${
                        profileErrors.phone ? 'profile__input--error' : ''
                      }`}
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      aria-invalid={profileErrors.phone ? 'true' : 'false'}
                      aria-describedby={
                        profileErrors.phone ? 'phone-error' : undefined
                      }
                    />
                    {profileErrors.phone && (
                      <p id="phone-error" className="profile__error">
                        {profileErrors.phone}
                      </p>
                    )}
                  </div>

                  <button type="submit" className="profile__submit">
                    Save changes
                  </button>
                </form>
              </div>
            </section>
          )}

          {/* SETTINGS */}
          {activeTab === 'settings' && (
            <section className="account__section" aria-labelledby="settings-heading">
              <header className="account__section-header">
                <h1 id="settings-heading" className="account__title">
                  Settings
                </h1>
                <p className="account__lead">
                  Demo preferences — saved to this session only.
                </p>
              </header>

              <form className="settings" onSubmit={handleSettingsSubmit}>
                {settingsSaved && (
                  <div className="profile__notice" role="status">
                    Preferences saved for this session only — demo mode.
                  </div>
                )}

                <fieldset className="settings__group">
                  <legend className="settings__group-title">
                    Contact preferences
                  </legend>

                  <label className="settings__check">
                    <input
                      type="checkbox"
                      name="emailUpdates"
                      checked={contactPrefs.emailUpdates}
                      onChange={handleContactPrefChange}
                    />
                    <span>Email updates about my reservations</span>
                  </label>

                  <label className="settings__check">
                    <input
                      type="checkbox"
                      name="smsReminders"
                      checked={contactPrefs.smsReminders}
                      onChange={handleContactPrefChange}
                    />
                    <span>SMS reminders before my table</span>
                  </label>

                  <label className="settings__check">
                    <input
                      type="checkbox"
                      name="pushNotifications"
                      checked={contactPrefs.pushNotifications}
                      onChange={handleContactPrefChange}
                    />
                    <span>Push notifications</span>
                  </label>

                  <label className="settings__check">
                    <input
                      type="checkbox"
                      name="marketingOffers"
                      checked={contactPrefs.marketingOffers}
                      onChange={handleContactPrefChange}
                    />
                    <span>Seasonal offers and news</span>
                  </label>
                </fieldset>

                <fieldset className="settings__group">
                  <legend className="settings__group-title">
                    Language preference
                  </legend>

                  <label className="settings__radio">
                    <input
                      type="radio"
                      name="language"
                      value="en"
                      checked={language === 'en'}
                      onChange={handleLanguageChange}
                    />
                    <span>English</span>
                  </label>

                  <label className="settings__radio">
                    <input
                      type="radio"
                      name="language"
                      value="ka"
                      checked={language === 'ka'}
                      onChange={handleLanguageChange}
                    />
                    <span>ქართული (Georgian)</span>
                  </label>

                  <label className="settings__radio">
                    <input
                      type="radio"
                      name="language"
                      value="ru"
                      checked={language === 'ru'}
                      onChange={handleLanguageChange}
                    />
                    <span>Русский (Russian)</span>
                  </label>
                </fieldset>

                <button type="submit" className="profile__submit">
                  Save preferences
                </button>
              </form>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

/* --- Clickable reservation card --- */

function BookingCard({ booking }) {
  return (
    <li className="data-card data-card--clickable">
      <Link
        to={`/account/bookings/${booking.id}`}
        className="data-card__link"
        aria-label={`View booking ${booking.id} at ${booking.restaurant.name}`}
      >
        <div className="data-card__main">
          <p className="data-card__title">{booking.restaurant.name}</p>
          <p className="data-card__subtitle">{booking.restaurant.address}</p>
          <dl className="data-card__meta">
            <div>
              <dt>Date</dt>
              <dd>{formatDate(booking.date)}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>{booking.time}</dd>
            </div>
            <div>
              <dt>Guests</dt>
              <dd>{booking.guests}</dd>
            </div>
            {booking.items.length > 0 && (
              <div>
                <dt>Pre-order</dt>
                <dd>{booking.items.length} item{booking.items.length === 1 ? '' : 's'}</dd>
              </div>
            )}
          </dl>
        </div>
        <div className="data-card__aside">
          <span className={`status-badge status-badge--${booking.status}`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
          <span className="data-card__id">{booking.id}</span>
          <span className="data-card__arrow" aria-hidden="true">→</span>
        </div>
      </Link>
    </li>
  )
}

export default Account