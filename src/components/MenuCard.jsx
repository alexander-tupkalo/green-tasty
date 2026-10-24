import { useState, useRef } from 'react'
import './MenuCard.css'

function MenuCard({ item, onAdd, buttonLabel = 'Add to cart' }) {
  const [added, setAdded] = useState(false)
  const timerRef = useRef(null)

  const handleAdd = () => {
    onAdd({ name: item.name, price: item.price })
    setAdded(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setAdded(false), 1200)
  }

  return (
    <li className="menu-item">
      <article className="menu-item__body">
        <div className="menu-item__media">
          {item.image ? (
            <img
              src={item.image}
              alt={item.imageAlt}
              className="menu-item__image"
              loading="lazy"
            />
          ) : (
            <div
              className="menu-item__media-placeholder"
              aria-hidden="true"
            >
              <span className="menu-item__media-label">
                {item.name}
              </span>
            </div>
          )}
        </div>

        <div className="menu-item__content">
          <div className="menu-item__header">
            <h4 className="menu-item__name">{item.name}</h4>
            <span className="menu-item__price">{item.price}</span>
          </div>
          <p className="menu-item__description">
            {item.description}
          </p>

          <button
            type="button"
            className={`menu-item__add-button ${
              added ? 'menu-item__add-button--added' : ''
            }`}
            onClick={handleAdd}
            aria-label={`${buttonLabel} ${item.name}`}
          >
            {added ? 'Added ✓' : buttonLabel}
          </button>
        </div>
      </article>
    </li>
  )
}

export default MenuCard