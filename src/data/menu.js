import khachapuriImage from '../assets/khachapuri-adjarian.jpg'
import khinkaliImage from '../assets/khinkali.jpg'
import pkhaliImage from '../assets/green-tasty-dish-3.jpg'
import tomatoSaladImage from '../assets/green-tasty-dish-2.jpg'
import seasonalSaladImage from '../assets/green-tasty-dish.jpg'
import beetrootSaladImage from '../assets/green-tasty-dish-4.jpg'
import herbCucumberSaladImage from '../assets/green-tasty-dish-5.jpg'
import mtsvadiImage from '../assets/mtsvadi.jpg'
import churchkhelaImage from '../assets/churchkhela.jpg'

export const FOOD_CATEGORIES = [
  {
    id: 'khachapuri',
    title: 'Khachapuri & Bakery',
    items: [
      {
        name: 'Adjarian Khachapuri',
        description:
          'Boat-shaped bread filled with molten cheese, topped with butter and a runny egg yolk.',
        price: '$12.50',
        image: khachapuriImage,
        imageAlt:
          'Adjarian khachapuri — boat-shaped bread with molten cheese, butter and a runny egg yolk on top',
      },
      {
        name: 'Imeretian Khachapuri',
        description:
          'Round flatbread stuffed with mild Imeretian cheese — the everyday Georgian classic.',
        price: '$10.00',
      },
      {
        name: 'Megrelian Khachapuri',
        description:
          'Cheese-filled bread topped with an extra layer of melted cheese, double the comfort.',
        price: '$11.50',
      },
      {
        name: 'Georgian Shoti Bread',
        description:
          'Hand-shaped sourdough loaf baked in a clay tone, crisp crust and soft crumb.',
        price: '$4.50',
      },
    ],
  },
  {
    id: 'starters',
    title: 'Starters & Sharing',
    items: [
      {
        name: 'Khinkali',
        description:
          'Hand-folded soup dumplings with spiced meat and broth. Hold the knot, sip the juice.',
        price: '$9.00',
        image: khinkaliImage,
        imageAlt:
          'Khinkali — hand-folded Georgian soup dumplings with spiced meat filling',
      },
      {
        name: 'Pkhali Assortment',
        description:
          'Three seasonal pkhali — spinach, beetroot, and eggplant — with walnut paste and pomegranate.',
        price: '$8.50',
        image: pkhaliImage,
        imageAlt:
          'Pkhali assortment — three colorful Georgian vegetable and walnut paste molds on a cream plate',
      },
      {
        name: 'Badrijani Nigvzit',
        description:
          'Crispy eggplant rolls filled with seasoned walnut paste, topped with pomegranate seeds.',
        price: '$10.00',
      },
      {
        name: 'Georgian Cheese Board',
        description:
          'Selection of Georgian mountain cheeses — Sulguni, Imeretian, and aged Guda — with shoti bread.',
        price: '$13.00',
      },
    ],
  },
  {
    id: 'salads',
    title: 'Salads & Fresh',
    items: [
      {
        name: 'Georgian Tomato & Cucumber Salad',
        description:
          'Ripe tomatoes, cucumbers, red onion and basil with sunflower oil and tkemali vinegar.',
        price: '$7.50',
        image: tomatoSaladImage,
        imageAlt:
          'Georgian tomato and cucumber salad with red onion, basil and sunflower oil on a cream plate',
      },
      {
        name: 'Green Tasty Seasonal Salad',
        description:
          'Our signature bowl — figs, citrus, avocado and herbs with a light pomegranate dressing.',
        price: '$11.00',
        image: seasonalSaladImage,
        imageAlt:
          'Signature seasonal salad with figs, citrus, avocado and herbs in a ceramic bowl',
      },
      {
        name: 'Beetroot & Walnut Salad',
        description:
          'Roasted beetroot, crushed walnuts and prunes with a gentle garlic-walnut sauce.',
        price: '$8.00',
        image: beetrootSaladImage,
        imageAlt:
          'Beetroot and walnut salad with prunes and garlic-walnut sauce on a cream plate',
      },
      {
        name: 'Fresh Herb & Cucumber Salad',
        description:
          'Cilantro, tarragon, basil, and cucumber tossed in a light yogurt-garlic dressing.',
        price: '$7.00',
        image: herbCucumberSaladImage,
        imageAlt:
          'Fresh herb and cucumber salad with cilantro, tarragon and basil in a light yogurt-garlic dressing',
      },
    ],
  },
  {
    id: 'mains',
    title: 'Georgian Mains',
    items: [
      {
        name: 'Mtsvadi',
        description:
          'Charcoal-grilled pork skewers marinated in wine and onion, served with tkemali.',
        price: '$16.50',
        image: mtsvadiImage,
        imageAlt:
          'Mtsvadi — charcoal-grilled Georgian pork skewers served with tkemali sauce',
      },
      {
        name: 'Shkmeruli',
        description:
          'Pan-fried chicken in a rich garlic and milk cream sauce — a Rustavi family recipe.',
        price: '$15.00',
      },
      {
        name: 'Chakhokhbili',
        description:
          'Slow-stewed chicken with tomatoes, herbs, and bell peppers, finished with fresh cilantro.',
        price: '$14.50',
      },
      {
        name: 'Ojakhuri',
        description:
          'Roasted pork and potatoes with onions, herbs, and a touch of tkemali, served in a ketsi.',
        price: '$15.50',
      },
    ],
  },
  {
    id: 'desserts',
    title: 'Desserts',
    items: [
      {
        name: 'Churchkhela',
        description:
          'Walnuts threaded on a string and dipped in thickened grape must — a Georgian winter treat.',
        price: '$5.50',
        image: churchkhelaImage,
        imageAlt:
          'Churchkhela — Georgian walnut and grape must candy on a string',
      },
      {
        name: 'Pelamushi',
        description:
          'Smooth grape must and cornmeal pudding, served chilled with crushed walnuts.',
        price: '$5.00',
      },
      {
        name: 'Medovik',
        description:
          'Layered honey cake with sour cream frosting — a post-Soviet café classic done right.',
        price: '$6.50',
      },
      {
        name: 'Georgian Yogurt with Honey & Walnuts',
        description:
          'Thick matsoni yogurt, mountain honey, and toasted walnuts — simple and bright.',
        price: '$5.50',
      },
    ],
  },
]

export const BAR_CATEGORIES = [
  {
    id: 'drinks-soft',
    title: 'Soft Drinks & Lemonades',
    items: [
      {
        name: 'Coca-Cola',
        description: 'Chilled 330 ml glass bottle, served with a slice of lemon.',
        price: '$2.50',
      },
      {
        name: 'Sprite',
        description: 'Chilled 330 ml glass bottle, served with a slice of lime.',
        price: '$2.50',
      },
      {
        name: 'Natakhtari Tarkhun',
        description: 'Sweet Georgian tarragon lemonade, bright green and aromatic.',
        price: '$3.00',
      },
      {
        name: 'Natakhtari Pear',
        description: 'Mild, fragrant Georgian pear lemonade from the Natakhtari brewery.',
        price: '$3.00',
      },
    ],
  },
  {
    id: 'drinks-wine',
    title: 'Georgian Wine',
    items: [
      {
        name: 'Saperavi (Red)',
        description: 'Full-bodied dry red from Kakheti — dark berry, spice, and a long finish.',
        price: '$7.50',
      },
      {
        name: 'Rkatsiteli (White)',
        description: 'Crisp dry white with notes of green apple, citrus, and a mineral edge.',
        price: '$7.00',
      },
      {
        name: 'Kisi Qvevri (Amber)',
        description: 'Amber skin-contact wine aged in qvevri — apricot, dried fruit, and tannin.',
        price: '$9.00',
      },
      {
        name: 'Kindzmarauli (Semi-sweet Red)',
        description: 'Naturally semi-sweet red with ripe cherry and plum notes, served chilled.',
        price: '$8.00',
      },
    ],
  },
  {
    id: 'drinks-spirits',
    title: 'Spirits',
    items: [
      {
        name: 'Georgian Chacha',
        description: 'Grape pomace brandy, clear and strong — a Georgian table staple.',
        price: '$6.00',
      },
      {
        name: 'Georgian Brandy',
        description: 'Aged Georgian brandy with caramel and dried-fruit notes, served neat.',
        price: '$8.50',
      },
      {
        name: 'Whisky',
        description: 'Classic blended whisky, served neat or with a single ice cube.',
        price: '$9.00',
      },
      {
        name: 'Vodka',
        description: 'Clean wheat vodka, served chilled with a side of pickles.',
        price: '$7.00',
      },
    ],
  },
]

export const CATEGORY_NAV = [
  { id: 'all', label: 'All' },
  { id: 'khachapuri', label: 'Khachapuri' },
  { id: 'starters', label: 'Starters' },
  { id: 'salads', label: 'Salads' },
  { id: 'mains', label: 'Mains' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'drinks', label: 'Drinks' },
]

export function getAllMenuItems() {
  return [...FOOD_CATEGORIES, ...BAR_CATEGORIES].flatMap((c) => c.items)
}