import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { createGroup } from '../api/services';
import '../styles/CreateGroup.css';

function CreateGroup() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState(['']); // Start with 1 empty input
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Member input change chesaaka update avutundi
  const handleMemberChange = (index, value) => {
    const updated = [...members];
    updated[index] = value;
    setMembers(updated);
  };

  // "Add Member" button — oka empty input add avutundi
  const addMemberField = () => {
    setMembers([...members, '']);
  };

  // "Remove" button — aa member input remove avutundi
  const removeMemberField = (index) => {
    const updated = members.filter((_, i) => i !== index);
    setMembers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Empty member ids filter out chestam
    const memberIds = members
      .map((m) => m.trim())
      .filter((m) => m !== '');

    // Creator ni kuda members lo include chestam
    if (!memberIds.includes(userId)) {
      memberIds.push(userId);
    }

    const groupData = {
      name: groupName,
      createdBy: userId,
      memberIds: memberIds,
    };

    try {
      await createGroup(groupData);
      alert('✅ Group created successfully!');
      navigate('/dashboard');
    } catch {
      setError('❌ Failed to create group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="creategroup-wrapper">
      <Navbar />

      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">

            {/* Header */}
            <div className="d-flex align-items-center mb-4">
              <button
                className="btn btn-light btn-sm me-3"
                onClick={() => navigate('/dashboard')}
              >
                <i className="bi bi-arrow-left"></i>
              </button>
              <div>
                <h4 className="fw-bold mb-0">Create New Group</h4>
                <p className="text-muted small mb-0">Add members by their User ID</p>
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 p-4">

              {error && (
                <div className="alert alert-danger py-2 small">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
                </div>
              )}

              <form onSubmit={handleSubmit}>

                {/* Group Name */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Group Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-people-fill text-primary"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Goa Trip, Office Lunch"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Members */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Members <span className="text-muted fw-normal">(Enter User IDs)</span>
                  </label>

                  {members.map((member, index) => (
                    <div className="input-group mb-2" key={index}>
                      <span className="input-group-text bg-light">
                        <i className="bi bi-person-fill text-primary"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={`Member ${index + 1} User ID`}
                        value={member}
                        onChange={(e) => handleMemberChange(index, e.target.value)}
                      />
                      {members.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => removeMemberField(index)}
                        >
                          <i className="bi bi-trash3-fill"></i>
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm mt-1"
                    onClick={addMemberField}
                  >
                    <i className="bi bi-plus-circle me-2"></i>Add Another Member
                  </button>
                </div>

                {/* Your ID info box */}
                <div className="info-box mb-4 p-3 rounded-3">
                  <i className="bi bi-info-circle-fill text-primary me-2"></i>
                  <span className="small text-muted">
                    Your ID <strong className="text-dark">({userId})</strong> will be auto-added as creator.
                  </span>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-bold py-2 rounded-3"
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Creating...</>
                  ) : (
                    <><i className="bi bi-plus-circle-fill me-2"></i>Create Group</>
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

export default CreateGroup;