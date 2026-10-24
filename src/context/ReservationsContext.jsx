import { createContext, useContext, useState, useMemo, useCallback } from 'react'

const ReservationsContext = createContext(null)

let bookingCounter = 0

function generateBookingId() {
  bookingCounter += 1
  const ts = Date.now().toString(36).toUpperCase().slice(-5)
  return `R-${ts}${bookingCounter}`
}

export function ReservationsProvider({ children }) {
  // bookings: [{ id, restaurant, date, time, guests, tableId, items, contact, status, createdAt }]
  const [bookings, setBookings] = useState([])

  const addBooking = useCallback((data) => {
    const newBooking = {
      id: generateBookingId(),
      restaurant: data.restaurant,
      date: data.date,
      time: data.time,
      guests: data.guests,
      tableId: data.tableId,
      items: data.items || [],
      contact: data.contact,
      status: 'upcoming',
      createdAt: new Date().toISOString(),
    }
    setBookings((prev) => [newBooking, ...prev])
    return newBooking
  }, [])

  const cancelBooking = useCallback((id) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: 'cancelled' } : b
      )
    )
  }, [])

  const getBookingById = useCallback(
    (id) => bookings.find((b) => b.id === id) || null,
    [bookings]
  )

  const upcomingBookings = useMemo(
    () => bookings.filter((b) => b.status === 'upcoming'),
    [bookings]
  )

  const pastBookings = useMemo(
    () => bookings.filter((b) => b.status !== 'upcoming'),
    [bookings]
  )

  const value = useMemo(
    () => ({
      bookings,
      upcomingBookings,
      pastBookings,
      addBooking,
      cancelBooking,
      getBookingById,
    }),
    [bookings, upcomingBookings, pastBookings, addBooking, cancelBooking, getBookingById]
  )

  return (
    <ReservationsContext.Provider value={value}>
      {children}
    </ReservationsContext.Provider>
  )
}

export function useReservations() {
  const ctx = useContext(ReservationsContext)
  if (!ctx) {
    throw new Error('useReservations must be used within a ReservationsProvider')
  }
  return ctx
}