import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

const SharedOrderContext = createContext(null)

const STORAGE_KEY = 'gt_shared_orders'
const GUEST_KEY_PREFIX = 'gt_guest_'

// --- localStorage helpers ---

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch (e) {
    return {}
  }
}

function writeStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    /* ignore */
  }
}

let participantCounter = 0
function generateParticipantId() {
  participantCounter += 1
  return `P-${Date.now().toString(36).toUpperCase().slice(-4)}${participantCounter}`
}

function generateItemId(name) {
  return `${name}-${Date.now().toString(36)}`
}

export function SharedOrderProvider({ children }) {
  const [orders, setOrders] = useState(() => readStorage())

  // Cross-tab sync
  useEffect(() => {
    function handleStorage(e) {
      if (e.key === STORAGE_KEY) {
        setOrders(readStorage())
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const persist = useCallback((next) => {
    setOrders(next)
    writeStorage(next)
  }, [])

  // Auto-create a shared order for a booking. Called once after
  // the booking is confirmed. Stores a snapshot of the booking
  // details so guests (who don't have the booking in their
  // ReservationsContext) can still see restaurant / date / time.
  const startSharedOrder = useCallback(
    (booking) => {
      if (orders[booking.id]) return orders[booking.id]

      const organizerId = generateParticipantId()
      const newOrder = {
        bookingId: booking.id,
        status: 'open',
        createdAt: new Date().toISOString(),
        closedAt: null,
        booking: {
          id: booking.id,
          restaurant: booking.restaurant,
          date: booking.date,
          time: booking.time,
          guests: booking.guests,
          tableId: booking.tableId,
          contact: booking.contact,
        },
        participants: [
          {
            id: organizerId,
            name: booking.contact.fullName || 'Organizer',
            isOrganizer: true,
            items: [],
          },
        ],
      }

      const next = { ...orders, [booking.id]: newOrder }
      persist(next)
      return newOrder
    },
    [orders, persist]
  )

  const getSharedOrder = useCallback(
    (bookingId) => orders[bookingId] || null,
    [orders]
  )

  // Guest joins by entering their name. Their participantId is
  // saved to localStorage so the same browser remembers them.
  const joinAsGuest = useCallback(
    (bookingId, name) => {
      const order = orders[bookingId]
      if (!order || order.status === 'closed') return null

      const newParticipant = {
        id: generateParticipantId(),
        name: name || 'Guest',
        isOrganizer: false,
        items: [],
      }

      const next = {
        ...orders,
        [bookingId]: {
          ...order,
          participants: [...order.participants, newParticipant],
        },
      }
      persist(next)

      try {
        localStorage.setItem(GUEST_KEY_PREFIX + bookingId, newParticipant.id)
      } catch (e) {
        /* ignore */
      }

      return newParticipant
    },
    [orders, persist]
  )

  // Returns the participantId this browser is associated with,
  // or null if not joined yet. Organizers don't have a guest key
  // — they're identified by having the booking in ReservationsContext.
  const getGuestParticipantId = useCallback((bookingId) => {
    try {
      return localStorage.getItem(GUEST_KEY_PREFIX + bookingId) || null
    } catch (e) {
      return null
    }
  }, [])

  const addItem = useCallback(
    (bookingId, participantId, item) => {
      const order = orders[bookingId]
      if (!order || order.status === 'closed') return

      const next = {
        ...orders,
        [bookingId]: {
          ...order,
          participants: order.participants.map((p) => {
            if (p.id !== participantId) return p
            const existing = p.items.find((it) => it.name === item.name)
            if (existing) {
              return {
                ...p,
                items: p.items.map((it) =>
                  it.name === item.name
                    ? { ...it, quantity: it.quantity + 1 }
                    : it
                ),
              }
            }
            return {
              ...p,
              items: [
                ...p.items,
                {
                  id: generateItemId(item.name),
                  name: item.name,
                  price: item.price,
                  quantity: 1,
                },
              ],
            }
          }),
        },
      }
      persist(next)
    },
    [orders, persist]
  )

  const removeItem = useCallback(
    (bookingId, participantId, itemId) => {
      const order = orders[bookingId]
      if (!order || order.status === 'closed') return

      const next = {
        ...orders,
        [bookingId]: {
          ...order,
          participants: order.participants.map((p) =>
            p.id !== participantId
              ? p
              : { ...p, items: p.items.filter((it) => it.id !== itemId) }
          ),
        },
      }
      persist(next)
    },
    [orders, persist]
  )

  const updateItemQuantity = useCallback(
    (bookingId, participantId, itemId, quantity) => {
      if (quantity < 1) {
        removeItem(bookingId, participantId, itemId)
        return
      }
      const order = orders[bookingId]
      if (!order || order.status === 'closed') return

      const next = {
        ...orders,
        [bookingId]: {
          ...order,
          participants: order.participants.map((p) =>
            p.id !== participantId
              ? p
              : {
                  ...p,
                  items: p.items.map((it) =>
                    it.id === itemId ? { ...it, quantity } : it
                  ),
                }
          ),
        },
      }
      persist(next)
    },
    [orders, persist, removeItem]
  )

  const closeCollection = useCallback(
    (bookingId) => {
      const order = orders[bookingId]
      if (!order) return
      persist({
        ...orders,
        [bookingId]: {
          ...order,
          status: 'closed',
          closedAt: new Date().toISOString(),
        },
      })
    },
    [orders, persist]
  )

  const reopenCollection = useCallback(
    (bookingId) => {
      const order = orders[bookingId]
      if (!order) return
      persist({
        ...orders,
        [bookingId]: {
          ...order,
          status: 'open',
          closedAt: null,
        },
      })
    },
    [orders, persist]
  )

  const value = useMemo(
    () => ({
      orders,
      startSharedOrder,
      getSharedOrder,
      joinAsGuest,
      getGuestParticipantId,
      addItem,
      removeItem,
      updateItemQuantity,
      closeCollection,
      reopenCollection,
    }),
    [orders, startSharedOrder, getSharedOrder, joinAsGuest, getGuestParticipantId, addItem, removeItem, updateItemQuantity, closeCollection, reopenCollection]
  )

  return (
    <SharedOrderContext.Provider value={value}>
      {children}
    </SharedOrderContext.Provider>
  )
}

export function useSharedOrder() {
  const ctx = useContext(SharedOrderContext)
  if (!ctx) {
    throw new Error('useSharedOrder must be used within a SharedOrderProvider')
  }
  return ctx
}