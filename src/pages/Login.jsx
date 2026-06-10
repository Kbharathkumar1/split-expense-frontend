import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/services';
import '../styles/Login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginUser(formData);
      localStorage.setItem('userId', res.data.id);
      localStorage.setItem('userName', res.data.name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || '❌ Invalid email or password!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center login-bg">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5">
            <div className="card shadow-lg border-0 rounded-4 p-4">

              <div className="text-center mb-4">
                <div className="login-icon-wrap mb-3">
                  <i className="bi bi-wallet2 text-white fs-2"></i>
                </div>
                <h3 className="fw-bold text-dark">Welcome Back!</h3>
                <p className="text-muted small">Login to manage your expenses</p>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-envelope-fill text-success"></i>
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

                <div className="mb-4">
                  <label className="form-label fw-semibold">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-lock-fill text-success"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100 fw-bold py-2 rounded-3"
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Logging in...</>
                  ) : (
                    <><i className="bi bi-box-arrow-in-right me-2"></i>Login</>
                  )}
                </button>
              </form>

              <div className="text-center mt-3">
                <span className="text-muted small">No account? </span>
                <Link to="/register" className="text-success fw-semibold small text-decoration-none">
                  Register here
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;