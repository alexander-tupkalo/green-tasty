import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import khachapuriImage from '../assets/khachapuri-adjarian.jpg'
import khinkaliImage from '../assets/khinkali.jpg'
import pkhaliImage from '../assets/green-tasty-dish-3.jpg'
import tomatoSaladImage from '../assets/green-tasty-dish-2.jpg'
import seasonalSaladImage from '../assets/green-tasty-dish.jpg'
import beetrootSaladImage from '../assets/green-tasty-dish-4.jpg'
import herbCucumberSaladImage from '../assets/green-tasty-dish-5.jpg'
import mtsvadiImage from '../assets/mtsvadi.jpg'
import churchkhelaImage from '../assets/churchkhela.jpg'
import './Cart.css'

/* Lookup from item name to its image. Only items that actually have
   a photo in /src/assets are listed here. Items not in this map
   render without an image (clean text-only layout). */
const ITEM_IMAGES = {
  'Adjarian Khachapuri': {
    src: khachapuriImage,
    alt: 'Adjarian khachapuri — boat-shaped bread with molten cheese, butter and a runny egg yolk',
  },
  'Khinkali': {
    src: khinkaliImage,
    alt: 'Khinkali — hand-folded Georgian soup dumplings',
  },
  'Pkhali Assortment': {
    src: pkhaliImage,
    alt: 'Pkhali assortment — three colorful Georgian vegetable and walnut paste molds on a cream plate',
  },
  'Georgian Tomato & Cucumber Salad': {
    src: tomatoSaladImage,
    alt: 'Georgian tomato and cucumber salad with red onion, basil and sunflower oil on a cream plate',
  },
  'Green Tasty Seasonal Salad': {
    src: seasonalSaladImage,
    alt: 'Signature seasonal salad with figs, citrus, avocado and herbs in a ceramic bowl',
  },
  'Beetroot & Walnut Salad': {
    src: beetrootSaladImage,
    alt: 'Beetroot and walnut salad with prunes and garlic-walnut sauce on a cream plate',
  },
  'Fresh Herb & Cucumber Salad': {
    src: herbCucumberSaladImage,
    alt: 'Fresh herb and cucumber salad with cilantro, tarragon and basil in a light yogurt-garlic dressing',
  },
  'Mtsvadi': {
    src: mtsvadiImage,
    alt: 'Mtsvadi — charcoal-grilled Georgian pork skewers',
  },
  'Churchkhela': {
    src: churchkhelaImage,
    alt: 'Churchkhela — Georgian walnut and grape must candy',
  },
}

function parsePrice(str) {
  return parseFloat(String(str).replace(/[^0-9.]/g, '')) || 0
}

function formatPrice(num) {
  return `$${num.toFixed(2)}`
}

function TrashIcon() {
  return (
    <svg
      className="cart-item__remove-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

function Cart() {
  const { items, totalCount, updateQuantity, removeItem, clearCart } = useCart()
  const [checkoutMessage, setCheckoutMessage] = useState(null)

  const subtotal = items.reduce(
    (sum, it) => sum + parsePrice(it.price) * it.quantity,
    0
  )
  const total = subtotal

  const handleDecrease = (item) => {
    updateQuantity(item.id, item.quantity - 1)
  }

  const handleIncrease = (item) => {
    updateQuantity(item.id, item.quantity + 1)
  }

  const handleRemove = (item) => {
    removeItem(item.id)
  }

  const handleClear = () => {
    if (items.length === 0) return
    const ok = window.confirm('Clear all items from your cart?')
    if (ok) {
      clearCart()
      setCheckoutMessage(null)
    }
  }

  const handleCheckout = () => {
    setCheckoutMessage({
      title: 'Checkout is not available yet.',
      text: 'Payment and order processing will be added in a future update. No payment has been processed.',
    })
  }

  // --- Empty state ---
  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-page__inner">
          <header className="cart-page__header">
            <p className="cart-page__eyebrow">YOUR CART</p>
            <h1 className="cart-page__title">Your cart is empty</h1>
            <p className="cart-page__lead">
              Browse our seasonal Georgian menu and add something
              tasty — khachapuri, khinkali, natural wine, and more.
            </p>
          </header>

          <div className="cart-empty">
            <div className="cart-empty__plate" aria-hidden="true">
              <span className="cart-empty__plate-text">Empty plate</span>
            </div>
            <Link to="/menu" className="cart-empty__cta">
              Browse menu
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // --- Cart with items ---
  return (
    <div className="cart-page">
      <div className="cart-page__inner">
        <header className="cart-page__header">
          <p className="cart-page__eyebrow">YOUR CART</p>
          <h1 className="cart-page__title">Your cart</h1>
          <p className="cart-page__lead">
            {totalCount} item{totalCount === 1 ? '' : 's'} ready to
            review before checkout.
          </p>
        </header>

        <div className="cart-layout">
          {/* Item list */}
          <section className="cart-items" aria-label="Cart items">
            <ul className="cart-items__list">
              {items.map((item) => {
                const image = ITEM_IMAGES[item.name]
                const lineTotal = parsePrice(item.price) * item.quantity
                return (
                  <li key={item.id} className="cart-item">
                    <div className="cart-item__media">
                      {image ? (
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="cart-item__image"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="cart-item__media-placeholder"
                          aria-hidden="true"
                        >
                          <span className="cart-item__media-label">
                            {item.name}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="cart-item__body">
                      <div className="cart-item__heading">
                        <h2 className="cart-item__name">{item.name}</h2>
                        <button
                          type="button"
                          className="cart-item__remove cart-item__remove--heading"
                          onClick={() => handleRemove(item)}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <TrashIcon />
                          <span>Remove</span>
                        </button>
                      </div>

                      <p className="cart-item__price">
                        {item.price} each
                      </p>

                      <div className="cart-item__controls">
                        <div
                          className="cart-item__quantity"
                          role="group"
                          aria-label={`Quantity for ${item.name}`}
                        >
                          <button
                            type="button"
                            className="cart-item__qty-btn"
                            onClick={() => handleDecrease(item)}
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            −
                          </button>
                          <span
                            className="cart-item__qty-value"
                            aria-live="polite"
                          >
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="cart-item__qty-btn"
                            onClick={() => handleIncrease(item)}
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          className="cart-item__remove cart-item__remove--inline"
                          onClick={() => handleRemove(item)}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <TrashIcon />
                          <span>Remove</span>
                        </button>

                        <p className="cart-item__line-total">
                          {formatPrice(lineTotal)}
                        </p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="cart-items__footer">
              <Link to="/menu" className="cart-items__continue">
                ← Continue shopping
              </Link>
              <button
                type="button"
                className="cart-items__clear"
                onClick={handleClear}
              >
                Clear cart
              </button>
            </div>
          </section>

          {/* Summary */}
          <aside className="cart-summary" aria-label="Order summary">
            <h2 className="cart-summary__title">Order summary</h2>

            <dl className="cart-summary__rows">
              <div className="cart-summary__row">
                <dt>Items</dt>
                <dd>{totalCount}</dd>
              </div>
              <div className="cart-summary__row">
                <dt>Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="cart-summary__row cart-summary__row--total">
                <dt>Total</dt>
                <dd aria-live="polite">{formatPrice(total)}</dd>
              </div>
            </dl>

            <p className="cart-summary__note">
              Taxes and service fees, if any, will be calculated at
              checkout.
            </p>

            {checkoutMessage && (
              <div className="cart-summary__notice" role="status">
                <strong className="cart-summary__notice-title">
                  {checkoutMessage.title}
                </strong>
                <span className="cart-summary__notice-text">
                  {checkoutMessage.text}
                </span>
              </div>
            )}

            <button
              type="button"
              className="cart-summary__checkout"
              onClick={handleCheckout}
            >
              Continue to checkout
            </button>

            <Link to="/menu" className="cart-summary__back">
              ← Back to menu
            </Link>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Cart