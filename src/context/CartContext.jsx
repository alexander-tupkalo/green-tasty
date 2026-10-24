import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import './CartContext.css'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  // items: [{ id, name, price, quantity }]
  const [items, setItems] = useState([])
  // lastAdded: { name, key } | null  — used for toast feedback
  const [lastAdded, setLastAdded] = useState(null)

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

    // Trigger toast — use a counter as key so the same item
    // added twice still re-triggers the toast animation.
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

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalCount = useMemo(
    () => items.reduce((sum, it) => sum + it.quantity, 0),
    [items]
  )

  const value = useMemo(
    () => ({
      items,
      totalCount,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      lastAdded,
    }),
    [items, totalCount, addItem, removeItem, updateQuantity, clearCart, lastAdded]
  )

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartToast lastAdded={lastAdded} />
    </CartContext.Provider>
  )
}

function CartToast({ lastAdded }) {
  if (!lastAdded) return null
  return (
    <div key={lastAdded.key} className="cart-toast" role="status" aria-live="polite">
      <span className="cart-toast__text">
        <strong>{lastAdded.name}</strong> added to cart
      </span>
    </div>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return ctx
}