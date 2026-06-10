import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getGroupById, getExpensesByGroup, getBalancesByGroup, settleBalance } from '../api/services';
import '../styles/GroupDetail.css';

function GroupDetail() {
  const { groupId } = useParams(); // URL nundi groupId teesukuntundi
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [settlingId, setSettlingId] = useState(null); // Which balance is settling

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [groupRes, expenseRes, balanceRes] = await Promise.all([
          getGroupById(groupId),
          getExpensesByGroup(groupId),
          getBalancesByGroup(groupId),
        ]);
        setGroup(groupRes.data);
        setExpenses(expenseRes.data);
        setBalances(balanceRes.data);
      } catch {
        setError('❌ Failed to load group details.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [groupId]);

  // Settle up button click chesaaka
  const handleSettle = async (balance) => {
    setSettlingId(balance.id);
    try {
      await settleBalance({
        groupId: groupId,
        payerId: balance.owedByUserId,
        payeeId: balance.owedToUserId,
        amount: balance.amount,
      });
      alert('✅ Settled successfully!');
      // Balances refresh cheyyadaniki
      const res = await getBalancesByGroup(groupId);
      setBalances(res.data);
    } catch {
      alert('❌ Settle failed. Try again.');
    } finally {
      setSettlingId(null);
    }
  };

  if (loading) return (
    <div className="groupdetail-wrapper">
      <Navbar />
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2 text-muted">Loading group details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="groupdetail-wrapper">
      <Navbar />
      <div className="container py-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="groupdetail-wrapper">
      <Navbar />

      <div className="container py-4">

        {/* Header */}
        <div className="d-flex align-items-center mb-4">
          <button
            className="btn btn-light btn-sm me-3"
            onClick={() => navigate('/dashboard')}
          >
            <i className="bi bi-arrow-left"></i>
          </button>
          <div>
            <h4 className="fw-bold mb-0">{group?.name}</h4>
            <p className="text-muted small mb-0">
              {group?.memberIds?.length || 0} members
            </p>
          </div>
          <button
            className="btn btn-primary fw-semibold ms-auto"
            onClick={() => navigate(`/group/${groupId}/add-expense`)}
          >
            <i className="bi bi-plus-circle-fill me-2"></i>Add Expense
          </button>
        </div>

        <div className="row g-4">

          {/* LEFT — Expenses */}
          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 p-3">
              <h6 className="fw-bold mb-3 px-2">
                <i className="bi bi-receipt me-2 text-primary"></i>Expenses
              </h6>

              {expenses.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-receipt display-4 text-muted"></i>
                  <p className="text-muted mt-2 small">No expenses yet!</p>
                </div>
              ) : (
                expenses.map((exp) => (
                  <div className="expense-item d-flex align-items-center p-3 mb-2 rounded-3" key={exp.id}>
                    <div className="expense-icon-wrap me-3">
                      <i className="bi bi-cash-coin text-white"></i>
                    </div>
                    <div className="flex-grow-1">
                      <p className="fw-semibold mb-0 small">{exp.description}</p>
                      <small className="text-muted">Paid by User {exp.paidByUserId}</small>
                    </div>
                    <div className="text-end">
                      <span className="fw-bold text-success">₹{exp.amount}</span>
                      <br />
                      <small className="text-muted">{exp.splitType}</small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT — Balances */}
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 p-3">
              <h6 className="fw-bold mb-3 px-2">
                <i className="bi bi-arrow-left-right me-2 text-success"></i>Balances
              </h6>

              {balances.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-check-circle display-4 text-success"></i>
                  <p className="text-muted mt-2 small">All settled up! 🎉</p>
                </div>
              ) : (
                balances.map((bal) => (
                  <div className="balance-item p-3 mb-2 rounded-3" key={bal.id}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="mb-0 small fw-semibold">
                          User {bal.owedByUserId}
                          <i className="bi bi-arrow-right mx-2 text-danger"></i>
                          User {bal.owedToUserId}
                        </p>
                        <span className="fw-bold text-danger">₹{bal.amount}</span>
                      </div>

                      {/* Show settle button only if logged-in user owes */}
                      {String(bal.owedByUserId) === String(userId) && (
                        <button
                          className="btn btn-success btn-sm fw-semibold"
                          onClick={() => handleSettle(bal)}
                          disabled={settlingId === bal.id}
                        >
                          {settlingId === bal.id ? (
                            <span className="spinner-border spinner-border-sm"></span>
                          ) : (
                            <><i className="bi bi-check2-circle me-1"></i>Settle</>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default GroupDetail;