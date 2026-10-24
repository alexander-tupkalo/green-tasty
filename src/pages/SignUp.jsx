import { useState } from 'react'
import { Link } from 'react-router-dom'
import registrationImage from '../assets/registration.jpg'
import './SignUp.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const PASSWORD_RULES = [
  { id: 'length', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { id: 'letter', label: 'At least one letter', test: (v) => /[a-zA-Z]/.test(v) },
  { id: 'digit', label: 'At least one digit', test: (v) => /\d/.test(v) },
]

function SignUp() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
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

    if (!form.fullName.trim()) {
      next.fullName = 'Full name is required.'
    } else if (form.fullName.trim().length < 2) {
      next.fullName = 'Please enter your full name.'
    }

    if (!form.email.trim()) {
      next.email = 'Email is required.'
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      next.email = 'Please enter a valid email address.'
    }

    if (!form.password) {
      next.password = 'Password is required.'
    } else if (!PASSWORD_RULES.every((rule) => rule.test(form.password))) {
      next.password = 'Password does not meet the requirements below.'
    }

    if (!form.confirmPassword) {
      next.confirmPassword = 'Please confirm your password.'
    } else if (form.confirmPassword !== form.password) {
      next.confirmPassword = 'Passwords do not match.'
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
        <div className="auth__form-wrap signup__form-wrap">
          <header className="auth__header">
            <h1 className="auth__title">Let&apos;s get started.</h1>
            <p className="auth__lead">
              Create an account to book tables and pre-order across our
              three Tbilisi restaurants.
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
              <label htmlFor="fullName" className="auth__label">
                Full name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="e.g. Nino Gelashvili"
                className={`auth__input ${
                  errors.fullName ? 'auth__input--error' : ''
                }`}
                value={form.fullName}
                onChange={handleChange}
                aria-invalid={errors.fullName ? 'true' : 'false'}
                aria-describedby={
                  errors.fullName ? 'fullName-error' : undefined
                }
                required
              />
              {errors.fullName && (
                <p id="fullName-error" className="auth__error">
                  {errors.fullName}
                </p>
              )}
            </div>

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
                autoComplete="new-password"
                placeholder="Create a password"
                className={`auth__input ${
                  errors.password ? 'auth__input--error' : ''
                }`}
                value={form.password}
                onChange={handleChange}
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby="password-rules"
                required
              />
              <ul
                id="password-rules"
                className="signup__password-rules"
                aria-label="Password requirements"
              >
                {PASSWORD_RULES.map((rule) => {
                  const ok = rule.test(form.password)
                  return (
                    <li
                      key={rule.id}
                      className={`signup__password-rule ${
                        ok ? 'signup__password-rule--ok' : ''
                      }`}
                    >
                      {rule.label}
                    </li>
                  )
                })}
              </ul>
              {errors.password && (
                <p className="auth__error">{errors.password}</p>
              )}
            </div>

            <div className="auth__field">
              <label htmlFor="confirmPassword" className="auth__label">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                className={`auth__input ${
                  errors.confirmPassword ? 'auth__input--error' : ''
                }`}
                value={form.confirmPassword}
                onChange={handleChange}
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                aria-describedby={
                  errors.confirmPassword ? 'confirmPassword-error' : undefined
                }
                required
              />
              {errors.confirmPassword && (
                <p id="confirmPassword-error" className="auth__error">
                  {errors.confirmPassword}
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
              {status === 'pending' ? 'Please wait…' : 'Create Account'}
            </button>
          </form>

          <p className="auth__alt">
            Already have an account?{' '}
            <Link to="/signin" className="auth__alt-link">
              Sign in
            </Link>
          </p>

          {/* Demo preview link — does NOT authenticate, just navigates */}
          <div className="auth__demo">
            <Link to="/account" className="auth__demo-link">
              Explore Demo Account
            </Link>
            <p className="auth__demo-text">
              Preview the account experience without registering.
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

export default SignUp