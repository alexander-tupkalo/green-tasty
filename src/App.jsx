import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Restaurants from './pages/Restaurants.jsx'
import RestaurantDetail from './pages/RestaurantDetail.jsx'
import Menu from './pages/Menu.jsx'
import Cart from './pages/Cart.jsx'
import Reservations from './pages/Reservations.jsx'
import Preorder from './pages/Preorder.jsx'
import Confirmation from './pages/Confirmation.jsx'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import Account from './pages/Account.jsx'
import BookingDetail from './pages/BookingDetail.jsx'
import SharedOrder from './pages/SharedOrder.jsx'
import NotFound from './pages/NotFound.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { PreorderProvider } from './context/PreorderContext.jsx'
import { ReservationsProvider } from './context/ReservationsContext.jsx'
import { SharedOrderProvider } from './context/SharedOrderContext.jsx'
import './App.css'

function App() {
  return (
    <CartProvider>
      <PreorderProvider>
        <ReservationsProvider>
          <SharedOrderProvider>
            <div className="app">
              <Header />

              <main className="app__main">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/restaurants" element={<Restaurants />} />
                  <Route path="/restaurants/:slug" element={<RestaurantDetail />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/reservations" element={<Reservations />} />
                  <Route path="/reservations/preorder" element={<Preorder />} />
                  <Route path="/reservations/confirmation" element={<Confirmation />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/account/bookings/:id" element={<BookingDetail />} />
                  <Route path="/account/bookings/:id/shared" element={<SharedOrder />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </SharedOrderProvider>
        </ReservationsProvider>
      </PreorderProvider>
    </CartProvider>
  )
}

export default App