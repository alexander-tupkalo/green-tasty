import { useState } from 'react'
import { Link } from 'react-router-dom'
import registrationImage from '../assets/registration.jpg'
import './SignIn.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function SignIn() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // 'idle' | 'pending' | 'info'
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validate = () => {
    const next = {}

    if (!form.email.trim()) {
      next.email = 'Email is required.'
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      next.email = 'Please enter a valid email address.'
    }

    if (!form.password) {
      next.password = 'Password is required.'
    } else if (form.password.length < 8) {
      next.password = 'Password must be at least 8 characters.'
    }

    return next
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) {
      return
    }

    setStatus('pending')
    setTimeout(() => {
      setStatus('info')
    }, 800)
  }

  return (
    <div className="auth">
      {/* Form panel — left column on desktop */}
      <main className="auth__panel">
        <div className="auth__form-wrap">
          <header className="auth__header">
            <h1 className="auth__title">Welcome back.</h1>
            <p className="auth__lead">
              Sign in to manage your bookings and pre-orders across
              our three Tbilisi restaurants.
            </p>
          </header>

          {status === 'info' && (
            <div className="auth__notice" role="status">
              <strong className="auth__notice-title">
                Account authentication is not connected yet.
              </strong>
              <span className="auth__notice-text">
                Real authentication will be available in a future
                update. No account was created or signed in.
              </span>
            </div>
          )}

          <form className="auth__form" onSubmit={handleSubmit} noValidate>
            <div className="auth__field">
              <label htmlFor="email" className="auth__label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="e.g. name@example.com"
                className={`auth__input ${
                  errors.email ? 'auth__input--error' : ''
                }`}
                value={form.email}
                onChange={handleChange}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                required
              />
              {errors.email && (
                <p id="email-error" className="auth__error">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="auth__field">
              <label htmlFor="password" className="auth__label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Your password"
                className={`auth__input ${
                  errors.password ? 'auth__input--error' : ''
                }`}
                value={form.password}
                onChange={handleChange}
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={
                  errors.password ? 'password-error' : undefined
                }
                required
              />
              {errors.password && (
                <p id="password-error" className="auth__error">
                  {errors.password}
                </p>
              )}
            </div>

            <label className="auth__checkbox">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              <span>Show password</span>
            </label>

            <button
              type="submit"
              className="auth__submit"
              disabled={status === 'pending'}
              aria-busy={status === 'pending'}
            >
              {status === 'pending' ? 'Please wait…' : 'Sign In'}
            </button>
          </form>

          <p className="auth__alt">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="auth__alt-link">
              Create one
            </Link>
          </p>

          {/* Demo preview link — does NOT authenticate, just navigates */}
          <div className="auth__demo">
            <Link to="/account" className="auth__demo-link">
              Explore Demo Account
            </Link>
            <p className="auth__demo-text">
              Preview the account experience without signing in.
            </p>
          </div>

          <p className="auth__back">
            <Link to="/restaurants" className="auth__back-link">
              ← Back to restaurants
            </Link>
          </p>
        </div>
      </main>

      {/* Image panel — right column on desktop */}
      <aside className="auth__brand" aria-hidden="true">
        <img
          src={registrationImage}
          alt="A warm, natural Green Tasty table setting with fresh herbs and Georgian dishes"
          className="auth__brand-image"
        />
      </aside>
    </div>
  )
}

export default SignIn