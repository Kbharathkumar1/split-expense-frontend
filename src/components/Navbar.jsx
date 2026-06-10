import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark nav-custom shadow-sm">
      <div className="container">

        {/* Logo */}
        <span className="navbar-brand fw-bold fs-4">
          <i className="bi bi-wallet2 me-2"></i>SplitEase
        </span>

        {/* Right side — username + logout */}
        <div className="d-flex align-items-center gap-3 ms-auto">
          <span className="text-white small">
            <i className="bi bi-person-circle me-1"></i>
            {userName}
          </span>
          <button
            className="btn btn-outline-light btn-sm fw-semibold"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-1"></i>Logout
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;