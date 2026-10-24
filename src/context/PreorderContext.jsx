import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import './PreorderContext.css'

const PreorderContext = createContext(null)

export function PreorderProvider({ children }) {
  // booking: { tableId, restaurant, date, time, guests } | null
  const [booking, setBooking] = useState(null)
  // items: [{ id, name, price, quantity }]
  const [items, setItems] = useState([])
  // lastAdded: { name, key } | null — for toast feedback
  const [lastAdded, setLastAdded] = useState(null)

  const setBookingData = useCallback((data) => {
    setBooking(data)
    // Reset items when a new booking is set — pre-order belongs to
    // a specific table/time, so leftover items from a previous
    // booking should not carry over.
    setItems([])
  }, [])

  const addItem = useCallback((item) => {
    if (!item || !item.name || !item.price) return

    setItems((prev) => {
      const existing = prev.find((it) => it.id === item.name)
      if (existing) {
        return prev.map((it) =>
          it.id === item.name
            ? { ...it, quantity: it.quantity + 1 }
            : it
        )
      }
      return [
        ...prev,
        {
          id: item.name,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ]
    })

    setLastAdded({ name: item.name, key: Date.now() })
  }, [])

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }, [])

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((it) => it.id !== id))
      return
    }
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, quantity } : it))
    )
  }, [])

  const clearPreorder = useCallback(() => {
    setItems([])
  }, [])

  const totalCount = useMemo(
    () => items.reduce((sum, it) => sum + it.quantity, 0),
    [items]
  )

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => {
      const price = parseFloat(String(it.price).replace(/[^0-9.]/g, '')) || 0
      return sum + price * it.quantity
    }, 0)
  }, [items])

  const value = useMemo(
    () => ({
      booking,
      items,
      totalCount,
      subtotal,
      setBookingData,
      addItem,
      removeItem,
      updateQuantity,
      clearPreorder,
      lastAdded,
    }),
    [booking, items, totalCount, subtotal, setBookingData, addItem, removeItem, updateQuantity, clearPreorder, lastAdded]
  )

  return (
    <PreorderContext.Provider value={value}>
      {children}
      <PreorderToast lastAdded={lastAdded} />
    </PreorderContext.Provider>
  )
}

function PreorderToast({ lastAdded }) {
  if (!lastAdded) return null
  return (
    <div key={lastAdded.key} className="preorder-toast" role="status" aria-live="polite">
      <span className="preorder-toast__text">
        <strong>{lastAdded.name}</strong> added to pre-order
      </span>
    </div>
  )
}

export function usePreorder() {
  const ctx = useContext(PreorderContext)
  if (!ctx) {
    throw new Error('usePreorder must be used within a PreorderProvider')
  }
  return ctx
}