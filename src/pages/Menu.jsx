import { useState, useRef } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { FOOD_CATEGORIES, BAR_CATEGORIES, CATEGORY_NAV } from '../data/menu.js'
import MenuCard from '../components/MenuCard.jsx'
import './Menu.css'

// Local nav without "All" — the menu shows one category at a time.
const MENU_NAV = CATEGORY_NAV.filter((item) => item.id !== 'all')

function Menu() {
  const { addItem } = useCart()
  // Default to the first food category — the page opens showing
  // Khachapuri & Bakery, not the entire menu at once.
  const [activeCategory, setActiveCategory] = useState('khachapuri')
  const navRef = useRef(null)

  const handleCategoryClick = (id) => {
    setActiveCategory(id)
    if (navRef.current) {
      const top =
        navRef.current.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  // Find the active category across food + bar.
  // Special case: "drinks" is a parent nav item that shows all
  // bar sub-categories (Soft, Wine, Spirits) together.
  const allCategories = [...FOOD_CATEGORIES, ...BAR_CATEGORIES]
  const isDrinks = activeCategory === 'drinks'
  const activeCategoryData = isDrinks
    ? null
    : allCategories.find((c) => c.id === activeCategory)

  return (
    <div className="menu-page">
      {/* Intro */}
      <header className="menu-page__intro">
        <p className="menu-page__eyebrow">GREEN TASTY &middot; OUR MENU</p>
        <h1 className="menu-page__title">A taste of Georgia.</h1>
        <p className="menu-page__lead">
          Traditional recipes, generous tables and Georgian hospitality.
        </p>
        <p className="menu-page__badge">DEMO MENU &middot; SAMPLE PRICES IN USD</p>
      </header>

      {/* Category navigation (no "All" option) */}
      <nav
        ref={navRef}
        className="menu-nav"
        aria-label="Menu categories"
      >
        <ul className="menu-nav__list">
          {MENU_NAV.map((item) => (
            <li key={item.id} className="menu-nav__item">
              <button
                type="button"
                className={`menu-nav__link ${
                  activeCategory === item.id ? 'menu-nav__link--active' : ''
                }`}
                aria-pressed={activeCategory === item.id}
                onClick={() => handleCategoryClick(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Active category (single) */}
      {activeCategoryData && !isDrinks && (
        <section
          className="menu-section"
          aria-labelledby="active-category-heading"
        >
          <div className="menu-section__header">
            <p className="menu-section__eyebrow">
              {BAR_CATEGORIES.some((c) => c.id === activeCategory)
                ? 'BAR MENU'
                : 'FOOD MENU'}
            </p>
            <h2
              id="active-category-heading"
              className="menu-section__title"
            >
              {activeCategoryData.title}
            </h2>
            <p className="menu-section__lead">
              {BAR_CATEGORIES.some((c) => c.id === activeCategory)
                ? 'Georgian wines, chacha, soft drinks, and a short list of international spirits — chosen to match the table.'
                : 'A tour through the Georgian table, from the bakery to the dessert plate.'}
            </p>
          </div>

          <div className="menu-section__categories">
            <section
              id={activeCategoryData.id}
              className="menu-category"
              aria-labelledby={`${activeCategoryData.id}-title`}
            >
              <h3
                id={`${activeCategoryData.id}-title`}
                className="menu-category__title"
              >
                {activeCategoryData.title}
              </h3>

              <ul className="menu-category__items">
                {activeCategoryData.items.map((item) => (
                  <MenuCard
                    key={item.name}
                    item={item}
                    onAdd={addItem}
                    buttonLabel="Add to cart"
                  />
                ))}
              </ul>
            </section>
          </div>
        </section>
      )}

      {/* Drinks — all 3 bar sub-categories together */}
      {isDrinks && (
        <section
          className="menu-section menu-section--bar"
          aria-labelledby="drinks-heading"
        >
          <div className="menu-section__header">
            <p className="menu-section__eyebrow">BAR MENU</p>
            <h2 id="drinks-heading" className="menu-section__title">
              From our bar
            </h2>
            <p className="menu-section__lead">
              Georgian wines, chacha, soft drinks, and a short list
              of international spirits — chosen to match the table.
            </p>
          </div>

          <div className="menu-section__categories">
            {BAR_CATEGORIES.map((category) => (
              <section
                key={category.id}
                id={category.id}
                className="menu-category"
                aria-labelledby={`${category.id}-title`}
              >
                <h3
                  id={`${category.id}-title`}
                  className="menu-category__title"
                >
                  {category.title}
                </h3>

                <ul className="menu-category__items">
                  {category.items.map((item) => (
                    <MenuCard
                      key={item.name}
                      item={item}
                      onAdd={addItem}
                      buttonLabel="Add to cart"
                    />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Menu