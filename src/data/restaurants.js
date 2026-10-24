import rest1Image from '../assets/rest-1.jpg'
import rest2Image from '../assets/rest-2.jpg'
import rest3Image from '../assets/rest-3.jpg'

export const RESTAURANTS = [
  {
    slug: 'old-tbilisi',
    name: 'Green Tasty — Old Tbilisi',
    area: 'Vera',
    address: '9 Abashidze Street',
    shortDescription:
      'A bright greenhouse-style dining room bathed in natural light, with hanging greenery and long wooden tables made for sharing.',
    longDescription:
      'Tucked into the leafy Vera neighborhood, our Old Tbilisi room is a sunlit greenhouse with a glass roof, hanging ferns, and long wooden tables meant for slow Georgian lunches. The bar pours natural wine all afternoon, while the open kitchen sends out khachapuri, khinkali, and seasonal pkhali as fast as the clay tones can bake them. Come for brunch, stay for the long evening.',
    image: rest1Image,
    imageAlt:
      'Sunlit greenhouse-style dining room with hanging greenery at 9 Abashidze Street',
    hours: [
      { day: 'Monday — Thursday', time: '10:00 — 23:00' },
      { day: 'Friday — Saturday', time: '10:00 — 01:00' },
      { day: 'Sunday', time: '11:00 — 23:00' },
    ],
  },
  {
    slug: 'riverside',
    name: 'Green Tasty — Riverside',
    area: 'Baratashvili',
    address: '14 Baratashvili Street',
    shortDescription:
      'A cozy brick-walled room with warm pendant lights and a view over the Mtkvari — ideal for slow evenings and natural wine.',
    longDescription:
      'On the southern bank of the Mtkvari, our Riverside room leans into the evening. Exposed brick walls, low pendant lights, and a row of window tables looking out at the river make it the right place for a long dinner with natural wine and shared plates. The kitchen runs the full menu until late, and the bar keeps pouring chacha and Saperavi well past midnight on weekends.',
    image: rest2Image,
    imageAlt:
      'Cozy brick-walled dining room with warm pendant lights at 14 Baratashvili Street',
    hours: [
      { day: 'Monday — Thursday', time: '12:00 — 23:00' },
      { day: 'Friday — Saturday', time: '12:00 — 02:00' },
      { day: 'Sunday', time: '12:00 — 23:00' },
    ],
  },
  {
    slug: 'rustaveli',
    name: 'Green Tasty — Rustaveli',
    area: 'Rustaveli',
    address: '48 Rustaveli Avenue',
    shortDescription:
      'Our flagship on Tbilisi\'s main avenue — a pergola-wrapped interior with a wood-paneled bar and an open kitchen.',
    longDescription:
      'Our flagship on Rustaveli Avenue sits inside a pergola-wrapped interior with a wood-paneled bar, an open kitchen, and a menu that pulls from every region of Georgia. It is the busiest of our three rooms and the easiest to walk into from the city center. Come early for a quiet coffee and shoti bread, or late for the post-theater crowd and a glass of Kindzmarauli.',
    image: rest3Image,
    imageAlt:
      'Pergola-wrapped interior with a wood-paneled bar at 48 Rustaveli Avenue',
    hours: [
      { day: 'Monday — Thursday', time: '09:00 — 23:00' },
      { day: 'Friday — Saturday', time: '09:00 — 01:00' },
      { day: 'Sunday', time: '09:00 — 23:00' },
    ],
  },
]

export function getRestaurantBySlug(slug) {
  return RESTAURANTS.find((r) => r.slug === slug)
}