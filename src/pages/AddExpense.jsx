import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getGroupById, addExpense } from '../api/services';
import '../styles/AddExpense.css';

function AddExpense() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    splitType: 'EQUAL',
    paidByUserId: userId,
  });

  // Group members fetch — split preview show cheyyadaniki
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await getGroupById(groupId);
        setGroup(res.data);
      } catch {
        setError('❌ Failed to load group info.');
      }
    };
    fetchGroup();
  }, [groupId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Per person amount calculate — EQUAL split preview
  const perPersonAmount = () => {
    const memberCount = group?.members?.length || 1;
    const amt = parseFloat(formData.amount);
    if (!amt || isNaN(amt)) return '0.00';
    return (amt / memberCount).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

   const expenseData = {
  groupId: parseInt(groupId),
  paidById: parseInt(userId),
  description: formData.description,
  amount: parseFloat(formData.amount),
  splitAmongUserIds: group.members.map((member) => parseInt(member.id)), // ← anni members ki split
};

    try {
      await addExpense(expenseData);
      alert('✅ Expense added successfully!');
      navigate(`/group/${groupId}`);
    } catch {
      setError('❌ Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addexpense-wrapper">
      <Navbar />

      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">

            {/* Header */}
            <div className="d-flex align-items-center mb-4">
              <button
                className="btn btn-light btn-sm me-3"
                onClick={() => navigate(`/group/${groupId}`)}
              >
                <i className="bi bi-arrow-left"></i>
              </button>
              <div>
                <h4 className="fw-bold mb-0">Add Expense</h4>
                <p className="text-muted small mb-0">
                  Group: <strong>{group?.name || '...'}</strong>
                </p>
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 p-4">

              {error && (
                <div className="alert alert-danger py-2 small">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
                </div>
              )}

              <form onSubmit={handleSubmit}>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-pencil-fill text-primary"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      name="description"
                      placeholder="e.g. Dinner, Hotel, Petrol"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Amount */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Total Amount (₹)</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-currency-rupee text-primary"></i>
                    </span>
                    <input
                      type="number"
                      className="form-control"
                      name="amount"
                      placeholder="Enter total amount"
                      value={formData.amount}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </div>
                </div>

                {/* Split Type */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Split Type</label>
                  <div className="d-flex gap-3">

                    {/* EQUAL */}
                    <div
                      className={`split-option flex-fill text-center p-3 rounded-3 ${formData.splitType === 'EQUAL' ? 'split-active' : ''}`}
                      onClick={() => setFormData({ ...formData, splitType: 'EQUAL' })}
                    >
                      <i className="bi bi-distribute-horizontal fs-4 text-primary"></i>
                      <p className="mb-0 fw-semibold small mt-1">Equal Split</p>
                      <small className="text-muted">Divide equally</small>
                    </div>

                    {/* EXACT */}
                    <div
                      className={`split-option flex-fill text-center p-3 rounded-3 ${formData.splitType === 'EXACT' ? 'split-active' : ''}`}
                      onClick={() => setFormData({ ...formData, splitType: 'EXACT' })}
                    >
                      <i className="bi bi-list-ol fs-4 text-success"></i>
                      <p className="mb-0 fw-semibold small mt-1">Exact Split</p>
                      <small className="text-muted">Custom amounts</small>
                    </div>

                  </div>
                </div>

                {/* EQUAL Split Preview */}
                {formData.splitType === 'EQUAL' && formData.amount && group && (
                  <div className="split-preview p-3 rounded-3 mb-4">
                    <p className="fw-semibold small mb-2">
                      <i className="bi bi-calculator me-2 text-primary"></i>
                      Split Preview
                    </p>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted small">
                        {group?.members?.length || 0} members
                      </span>
                      <span className="fw-bold text-primary">
                        ₹{perPersonAmount()} / person
                      </span>
                    </div>

                    {/* Member wise breakdown */}
                    <hr className="my-2" />
                    {group?.members?.map((member) => (
                      <div className="d-flex justify-content-between small py-1" key={member}>
                        <span className="text-muted">
                          <i className="bi bi-person-fill me-1"></i>
                          {member.name}
                          {String(member.id) === String(userId) && (
                            <span className="badge bg-primary ms-2 small">You</span>
                          )}
                        </span>
                        <span className="fw-semibold">₹{perPersonAmount()}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Paid By Info */}
                <div className="info-box p-3 rounded-3 mb-4">
                  <i className="bi bi-info-circle-fill text-primary me-2"></i>
                  <span className="small text-muted">
                    Paid by: <strong className="text-dark">You (User {userId})</strong>
                  </span>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-bold py-2 rounded-3"
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Adding Expense...</>
                  ) : (
                    <><i className="bi bi-plus-circle-fill me-2"></i>Add Expense</>
                  )}
                </button>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddExpense;