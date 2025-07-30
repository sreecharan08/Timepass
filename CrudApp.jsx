// App.jsx
import React, { useState } from 'react';


const App = () => {
  const [items, setItems] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      phone: '+1234567890',
      department: 'Engineering'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      phone: '+1987654321',
      department: 'Marketing'
    },
    { 
      id: 3, 
      name: 'Bob Johnson', 
      email: 'bob@example.com', 
      phone: '+1122334455',
      department: 'Sales'
    }
  ]);

  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Engineering'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: 'Engineering'
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  // CREATE - Add new item
  const handleCreate = () => {
    if (formData.name.trim() && formData.email.trim()) {
      const newItem = {
        id: Date.now(),
        ...formData
      };
      setItems([...items, newItem]);
      resetForm();
    }
  };

  // UPDATE - Edit existing item
  const handleUpdate = (id) => {
    if (formData.name.trim() && formData.email.trim()) {
      setItems(items.map(item => 
        item.id === id ? { ...item, ...formData } : item
      ));
      resetForm();
    }
  };

  // DELETE - Remove item
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const startEdit = (item) => {
    setFormData({
      name: item.name,
      email: item.email,
      phone: item.phone,
      department: item.department
    });
    setEditingId(item.id);
    setShowAddForm(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const showAdd = () => {
    resetForm();
    setShowAddForm(true);
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <h1 className="title">Employee Management System</h1>
          <button 
            className="btn btn-primary"
            onClick={showAdd}
          >
            <span className="icon">+</span>
            Add Employee
          </button>
        </header>

        {/* Add Form */}
        {showAddForm && (
          <div className="form-container">
            <div className="form-header">
              <h2>Add New Employee</h2>
              <button 
                className="btn btn-close"
                onClick={resetForm}
              >
                ×
              </button>
            </div>
            <form className="form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">Human Resources</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  className="btn btn-success"
                  onClick={handleCreate}
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Employee List */}
        <div className="content">
          {items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No employees found</h3>
              <p>Start by adding your first employee</p>
              <button 
                className="btn btn-primary"
                onClick={showAdd}
              >
                Add Employee
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Department</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id}>
                      {editingId === item.id ? (
                        <>
                          <td>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="table-input"
                            />
                          </td>
                          <td>
                            <select
                              name="department"
                              value={formData.department}
                              onChange={handleInputChange}
                              className="table-select"
                            >
                              <option value="Engineering">Engineering</option>
                              <option value="Marketing">Marketing</option>
                              <option value="Sales">Sales</option>
                              <option value="HR">Human Resources</option>
                              <option value="Finance">Finance</option>
                            </select>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleUpdate(item.id)}
                                title="Save"
                              >
                                Confirm
                              </button>
                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={resetForm}
                                title="Cancel"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>
                            <div className="employee-name">
                              <div className="avatar">
                                {item.name.charAt(0).toUpperCase()}
                              </div>
                              {item.name}
                            </div>
                          </td>
                          <td>{item.email}</td>
                          <td>{item.phone || 'N/A'}</td>
                          <td>
                            <span className={`department-badge ${item.department.toLowerCase().replace(' ', '-')}`}>
                              {item.department}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn btn-sm btn-warning"
                                onClick={() => startEdit(item)}
                                title="Edit"
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(item.id)}
                                title="Delete"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="stats">
          <div className="stat-card">
            <div className="stat-number">{items.length}</div>
            <div className="stat-label">Total Employees</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {items.filter(item => item.department === 'Engineering').length}
            </div>
            <div className="stat-label">Engineering</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {items.filter(item => item.department === 'Marketing').length}
            </div>
            <div className="stat-label">Marketing</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {items.filter(item => item.department === 'Sales').length}
            </div>
            <div className="stat-label">Sales</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;