// Register.jsx
// Kotta user create cheyyadaniki — name, email, password isthadu

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/services';
import '../styles/Register.css';

function Register() {
  const navigate = useNavigate();

  // Form data (object)— user type chesindi store avutundi ikkade
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');      // Error message
  const [loading, setLoading] = useState(false); // Button loading state

  // Input change — user type chesinapudu state update avutundi
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form submit — Register button click chesaaka
  const handleSubmit = async (e) => {
    e.preventDefault(); // Page reload aakunda aaputhundi
    setLoading(true);
    setError('');

    try {
      await registerUser(formData); // Backend ki data pamputundi
      alert('✅ Registration successful! Please login.');
      navigate('/login'); // Login page ki redirect
    } catch (err) {
      setError(err.response?.data?.message || '❌ Registration failed! Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center register-bg">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5">

            {/* Card */}
            <div className="card shadow-lg border-0 rounded-4 p-4">

              {/* Header */}
              <div className="text-center mb-4">
                <div className="register-icon-wrap mb-3">
                  <i className="bi bi-people-fill text-white fs-2"></i>
                </div>
                <h3 className="fw-bold text-dark">Create Account</h3>
                <p className="text-muted small">Split expenses with friends easily!</p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="alert alert-danger py-2 small" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>

                {/* Name */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-person-fill text-primary"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-envelope-fill text-primary"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-lock-fill text-primary"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-bold py-2 rounded-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus-fill me-2"></i>
                      Register
                    </>
                  )}
                </button>
              </form>

              {/* Login Link */}
              <div className="text-center mt-3">
                <span className="text-muted small">Already have an account? </span>
                <Link to="/login" className="text-primary fw-semibold small text-decoration-none">
                  Login here
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;