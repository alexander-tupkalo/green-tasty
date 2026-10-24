import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { RESTAURANTS } from '../data/restaurants.js'
import { usePreorder } from '../context/PreorderContext.jsx'
import bookTableImage from '../assets/book-a-table.png'
import './Reservations.css'

const TIME_SLOTS = [
  '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30',
]

const MOCK_TABLES = [
  { id: 'T1', restaurant: RESTAURANTS[2], maxGuests: 4 },
  { id: 'T2', restaurant: RESTAURANTS[1], maxGuests: 5 },
  { id: 'T3', restaurant: RESTAURANTS[0], maxGuests: 4 },
  { id: 'T4', restaurant: RESTAURANTS[2], maxGuests: 2 },
]

function isSlotAvailable(tableId, slot) {
  const str = tableId + slot
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) % 3 !== 0
}

function todayISO() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
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

const EMPTY_FORM = {
  location: 'all',
  date: '',
  time: 'all',
  guests: '2',
}

function Reservations() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [results, setResults] = useState([])
  // selectedTable: { tableId, slot } | null
  const [selectedTable, setSelectedTable] = useState(null)

  const navigate = useNavigate()
  const { setBookingData } = usePreorder()

  const today = useMemo(() => todayISO(), [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleGuestsChange = (delta) => {
    setForm((prev) => {
      const current = parseInt(prev.guests, 10) || 1
      const next = Math.max(1, Math.min(4, current + delta))
      return { ...prev, guests: String(next) }
    })
  }

  const validate = () => {
    const next = {}
    if (!form.date) {
      next.date = 'Choose date from the calendar'
    } else if (form.date < today) {
      next.date = 'Date cannot be in the past'
    }
    return next
  }

  const runSearch = (overrides = {}) => {
    const f = { ...form, ...overrides }
    const guestNum = parseInt(f.guests, 10) || 1
    let tables = MOCK_TABLES.filter((t) => t.maxGuests >= guestNum)
    if (f.location !== 'all') {
      tables = tables.filter((t) => t.restaurant.slug === f.location)
    }
    if (f.time !== 'all') {
      tables = tables.filter((t) => isSlotAvailable(t.id, f.time))
    }
    return tables
  }

  const handleFindTable = (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setResults(runSearch())
    setSearchPerformed(true)
    setSelectedTable(null)
  }

  const handleShowAllTimes = () => {
    const nextForm = { ...form, time: 'all' }
    setForm(nextForm)
    setResults(runSearch({ time: 'all' }))
    setSelectedTable(null)
  }

  const handleSlotClick = (table, slot) => {
    // Only available slots can be selected
    if (!isSlotAvailable(table.id, slot)) return
    setSelectedTable({ tableId: table.id, slot })
  }

  const handleContinueToPreorder = (table) => {
    if (!selectedTable || selectedTable.tableId !== table.id) return

    setBookingData({
      tableId: table.id,
      restaurant: table.restaurant,
      date: form.date,
      time: selectedTable.slot,
      guests: parseInt(form.guests, 10) || 1,
    })

    navigate('/reservations/preorder')
  }

  const locationLabel = form.location === 'all'
    ? 'All Locations'
    : RESTAURANTS.find((r) => r.slug === form.location)?.address || '—'

  return (
    <div className="reservations">
      <div className="reservations__inner">
        {/* Form */}
        <section className="reservations__form-section">
          <header className="reservations__form-header">
            <h1 className="reservations__form-title">Book a Table</h1>
            <p className="reservations__form-lead">
              Find an available table across our three Tbilisi restaurants.
            </p>
            <p className="reservations__badge">
              DEMO · TABLE RESERVATION IS NOT CONFIRMED
            </p>
          </header>

          <form
            className="reservations__form"
            onSubmit={handleFindTable}
            noValidate
          >
            {/* Location */}
            <div className="form-field">
              <label htmlFor="location" className="form-field__label">
                Location
              </label>
              <select
                id="location"
                name="location"
                className="form-field__control"
                value={form.location}
                onChange={handleChange}
              >
                <option value="all">All Locations</option>
                {RESTAURANTS.map((r) => (
                  <option key={r.slug} value={r.slug}>
                    {r.address}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="form-field">
              <label htmlFor="date" className="form-field__label">
                Date <span className="form-field__required">*</span>
              </label>
              <input
                id="date"
                name="date"
                type="date"
                min={today}
                className={`form-field__control ${
                  errors.date ? 'form-field__control--error' : ''
                }`}
                value={form.date}
                onChange={handleChange}
                aria-invalid={errors.date ? 'true' : 'false'}
                aria-describedby={errors.date ? 'date-error' : undefined}
                required
              />
              {errors.date && (
                <p id="date-error" className="form-field__error">
                  {errors.date}
                </p>
              )}
            </div>

            {/* Time */}
            <div className="form-field">
              <label htmlFor="time" className="form-field__label">
                Time
              </label>
              <select
                id="time"
                name="time"
                className="form-field__control"
                value={form.time}
                onChange={handleChange}
              >
                <option value="all">Show All</option>
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Guests */}
            <div className="form-field">
              <label className="form-field__label">Guests</label>
              <div
                className="guest-stepper"
                role="group"
                aria-label="Number of guests"
              >
                <button
                  type="button"
                  className="guest-stepper__btn"
                  onClick={() => handleGuestsChange(-1)}
                  disabled={parseInt(form.guests, 10) <= 1}
                  aria-label="Decrease number of guests"
                >
                  −
                </button>
                <span className="guest-stepper__value" aria-live="polite">
                  {form.guests}
                </span>
                <button
                  type="button"
                  className="guest-stepper__btn"
                  onClick={() => handleGuestsChange(1)}
                  disabled={parseInt(form.guests, 10) >= 4}
                  aria-label="Increase number of guests"
                >
                  +
                </button>
              </div>
            </div>

            <button type="submit" className="reservations__find-button">
              Find a Table
            </button>

            <p className="reservations__hint">
              For groups of 4+, please call{' '}
              <a href="tel:+1234566789990" className="reservations__hint-link">
                +123 456 678 9990
              </a>
            </p>
          </form>
        </section>

        {/* Results */}
        <section className="reservations__results" aria-live="polite">
          {/* Default state — before search */}
          {!searchPerformed && (
            <div
              className="reservations__results-default"
              style={{ backgroundImage: `url(${bookTableImage})` }}
            >
              <div className="reservations__results-default-veil" />
              <div className="reservations__results-default-content">
                <p className="reservations__results-default-text">
                  Choose your date, time, and party size to find an
                  available table.
                </p>
              </div>
            </div>
          )}

          {/* No tables state */}
          {searchPerformed && results.length === 0 && (
            <div className="reservations__no-tables">
              <div className="reservations__no-tables-illustration" aria-hidden="true">
                <span className="reservations__no-tables-icon">🍽️</span>
              </div>
              <h2 className="reservations__no-tables-title">
                No Tables Available
              </h2>
              <p className="reservations__no-tables-text">
                {locationLabel} · {formatDate(form.date)} ·{' '}
                {form.time === 'all' ? 'Any time' : form.time} ·{' '}
                {form.guests} guests
              </p>
              <p className="reservations__no-tables-hint">
                Try a different date, time, or number of guests.
              </p>
              {form.time !== 'all' && (
                <button
                  type="button"
                  className="reservations__no-tables-link"
                  onClick={handleShowAllTimes}
                >
                  Show all times for {formatDate(form.date)}
                </button>
              )}
            </div>
          )}

          {/* Results — table cards */}
          {searchPerformed && results.length > 0 && (
            <>
              <div className="reservations__results-header">
                <h2 className="reservations__results-title">
                  {results.length} table{results.length === 1 ? '' : 's'} available
                </h2>
                <p className="reservations__results-criteria">
                  {locationLabel} · {formatDate(form.date)} ·{' '}
                  {form.time === 'all' ? 'Any time' : form.time} ·{' '}
                  {form.guests} {form.guests === '1' ? 'guest' : 'guests'}
                </p>
                <p className="reservations__results-hint">
                  Click an available time slot to select a table, then
                  continue to pre-order.
                </p>
              </div>

              <ul className="table-list">
                {results.map((table) => {
                  const isThisSelected =
                    selectedTable && selectedTable.tableId === table.id
                  return (
                    <li key={table.id} className="table-card">
                      <div className="table-card__image-wrap">
                        <img
                          src={table.restaurant.image}
                          alt={table.restaurant.imageAlt}
                          className="table-card__image"
                          loading="lazy"
                        />
                      </div>

                      <div className="table-card__body">
                        <div className="table-card__header">
                          <h3 className="table-card__address">
                            {table.restaurant.address}
                          </h3>
                          <span className="table-card__capacity">
                            Up to {table.maxGuests} guests
                          </span>
                        </div>

                        <div className="table-card__slots-label">
                          Available time slots — click to select
                        </div>
                        <div className="table-card__slots">
                          {TIME_SLOTS.map((slot) => {
                            const available = isSlotAvailable(table.id, slot)
                            const isSelected =
                              isThisSelected && selectedTable.slot === slot
                            return (
                              <button
                                key={slot}
                                type="button"
                                className={`table-card__slot ${
                                  available ? 'table-card__slot--available' : ''
                                } ${
                                  isSelected ? 'table-card__slot--selected' : ''
                                }`}
                                onClick={() => handleSlotClick(table, slot)}
                                disabled={!available}
                                aria-pressed={isSelected}
                                aria-label={
                                  available
                                    ? `Select ${slot} at ${table.restaurant.address}`
                                    : `${slot} unavailable`
                                }
                              >
                                {slot}
                              </button>
                            )
                          })}
                        </div>

                        {isThisSelected && (
                          <div className="table-card__continue">
                            <p className="table-card__continue-text">
                              Selected: <strong>{selectedTable.slot}</strong>{' '}
                              at {table.restaurant.address}
                            </p>
                            <button
                              type="button"
                              className="table-card__continue-btn"
                              onClick={() => handleContinueToPreorder(table)}
                            >
                              Continue to pre-order →
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>

              <p className="reservations__demo-note">
                Demo availability — selecting a table does not confirm a
                booking. Real reservation flow is coming soon.
              </p>
            </>
          )}
        </section>
      </div>
    </div>
  )
}

export default Reservations