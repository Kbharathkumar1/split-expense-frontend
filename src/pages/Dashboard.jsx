import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getGroupsByUserId } from '../api/services';
import '../styles/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Page load ainaaka — user groups fetch chestundi
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await getGroupsByUserId(userId);
        setGroups(res.data);
      } catch {
        setError('Failed to load groups. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [userId]);

  return (
    <div className="dashboard-wrapper">
      <Navbar />

      <div className="container py-4">

        {/* Top bar */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold text-dark mb-0">My Groups</h4>
            <p className="text-muted small mb-0">All your expense groups</p>
          </div>
          <button
            className="btn btn-primary fw-semibold"
            onClick={() => navigate('/create-group')}
          >
            <i className="bi bi-plus-circle-fill me-2"></i>Create Group
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
            <p className="mt-2 text-muted">Loading your groups...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
          </div>
        )}

        {/* No groups */}
        {!loading && !error && groups.length === 0 && (
          <div className="empty-state text-center py-5">
            <i className="bi bi-people display-1 text-muted"></i>
            <h5 className="mt-3 text-muted">No groups yet!</h5>
            <p className="text-muted small">Create your first group to start splitting expenses</p>
            <button
              className="btn btn-primary mt-2"
              onClick={() => navigate('/create-group')}
            >
              <i className="bi bi-plus-circle me-2"></i>Create First Group
            </button>
          </div>
        )}

        {/* Groups Grid */}
        {!loading && !error && groups.length > 0 && (
          <div className="row g-3">
            {groups.map((group) => (
              <div className="col-12 col-sm-6 col-lg-4" key={group.id}>
                <div
                  className="card group-card border-0 shadow-sm h-100"
                  onClick={() => navigate(`/group/${group.id}`)}
                >
                  <div className="card-body p-4">

                    {/* Icon + Name */}
                    <div className="d-flex align-items-center mb-3">
                      <div className="group-icon-wrap me-3">
                        <i className="bi bi-people-fill text-white"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0 text-dark">{group.name}</h6>
                        <small className="text-muted">
                          {group.members?.length || 0} members
                        </small>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="badge bg-primary-subtle text-primary rounded-pill">
                        <i className="bi bi-receipt me-1"></i>View Expenses
                      </span>
                      <i className="bi bi-chevron-right text-muted"></i>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;