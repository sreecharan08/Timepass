// Employee Management System JavaScript

// In-memory storage for employees (replace with localStorage in production)
let employees = [];

// DOM elements
let employeeForm;
let employeeName;
let employeeTitle;
let employeeList;

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    initializeApp();
});

// Initialize application
function initializeApp() {
    // Get DOM elements
    employeeForm = document.getElementById("employeeForm");
    employeeName = document.getElementById("employeeName");
    employeeTitle = document.getElementById("employeeTitle");
    employeeList = document.getElementById("employeeList");

    // Set up event listeners
    setupEventListeners();

    // Load initial data
    loadEmployees();
}

// Set up event listeners
function setupEventListeners() {
    employeeForm.addEventListener("submit", handleFormSubmit);
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const newEmployeeName = employeeName.value.trim();
    const newEmployeeTitle = employeeTitle.value.trim();
    
    // Validate input
    if (!validateInput(newEmployeeName, newEmployeeTitle)) {
        return;
    }
    
    // Add new employee
    const newEmployee = {
        id: generateId(),
        name: newEmployeeName,
        title: newEmployeeTitle,
        dateAdded: new Date().toLocaleDateString()
    };
    
    employees.push(newEmployee);
    
    // Clear form
    clearForm();
    
    // Refresh display
    loadEmployees();
    
    // Show success message
    showMessage("Employee added successfully!", "success");
}

// Validate input data
function validateInput(name, title) {
    if (name === "" || title === "") {
        showMessage("Please fill in all fields", "error");
        return false;
    }
    
    if (name.length < 2) {
        showMessage("Employee name must be at least 2 characters long", "error");
        return false;
    }
    
    if (title.length < 2) {
        showMessage("Employee title must be at least 2 characters long", "error");
        return false;
    }
    
    // Check for duplicate names
    if (employees.some(emp => emp.name.toLowerCase() === name.toLowerCase())) {
        showMessage("Employee with this name already exists", "error");
        return false;
    }
    
    return true;
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Clear form inputs
function clearForm() {
    employeeName.value = "";
    employeeTitle.value = "";
    employeeName.focus();
}

// Load and display employees
function loadEmployees() {
    employeeList.innerHTML = '';

    if (employees.length === 0) {
        displayEmptyState();
        return;
    }

    employees.forEach((employee, index) => {
        const row = createEmployeeRow(employee, index);
        employeeList.appendChild(row);
    });
}

// Display empty state message
function displayEmptyState() {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="3" class="empty-message">No employees added yet. Add your first employee above!</td>`;
    employeeList.appendChild(row);
}

// Create employee table row
function createEmployeeRow(employee, index) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${escapeHtml(employee.name)}</td>
        <td>${escapeHtml(employee.title)}</td>
        <td>
            <button class="edit-btn" onclick="editEmployee(${index})" title="Edit Employee">
                Edit
            </button>
            <button class="delete-btn" onclick="deleteEmployee(${index})" title="Delete Employee">
                Delete
            </button>
        </td>
    `;
    return row;
}

// Escape HTML to prevent XSS attacks
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Edit employee function
function editEmployee(index) {
    if (!isValidIndex(index)) {
        showMessage("Invalid employee selection", "error");
        return;
    }

    const employee = employees[index];
    const updatedName = prompt("Edit Employee Name:", employee.name);
    
    if (updatedName === null) return; // User cancelled
    
    const updatedTitle = prompt("Edit Employee Title:", employee.title);
    
    if (updatedTitle === null) return; // User cancelled
    
    // Validate updated input
    const trimmedName = updatedName.trim();
    const trimmedTitle = updatedTitle.trim();
    
    if (trimmedName === "" || trimmedTitle === "") {
        showMessage("Name and title cannot be empty", "error");
        return;
    }
    
    if (trimmedName.length < 2 || trimmedTitle.length < 2) {
        showMessage("Name and title must be at least 2 characters long", "error");
        return;
    }
    
    // Check for duplicate names (excluding current employee)
    if (employees.some((emp, idx) => idx !== index && emp.name.toLowerCase() === trimmedName.toLowerCase())) {
        showMessage("Employee with this name already exists", "error");
        return;
    }
    
    // Update employee
    employees[index] = {
        ...employee,
        name: trimmedName,
        title: trimmedTitle
    };
    
    loadEmployees();
    showMessage("Employee updated successfully!", "success");
}

// Delete employee function
function deleteEmployee(index) {
    if (!isValidIndex(index)) {
        showMessage("Invalid employee selection", "error");
        return;
    }

    const employee = employees[index];
    const confirmDelete = confirm(`Are you sure you want to delete "${employee.name}"?\n\nThis action cannot be undone.`);
    
    if (confirmDelete) {
        employees.splice(index, 1);
        loadEmployees();
        showMessage("Employee deleted successfully!", "success");
    }
}

// Check if index is valid
function isValidIndex(index) {
    return index >= 0 && index < employees.length;
}

// Show message to user
function showMessage(message, type = "info") {
    // Simple alert for now - can be enhanced with custom modal
    alert(message);
}

// Search functionality (bonus feature)
function searchEmployees(searchTerm) {
    const filteredEmployees = employees.filter(employee => 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    displayFilteredEmployees(filteredEmployees);
}

// Display filtered employees
function displayFilteredEmployees(filteredEmployees) {
    employeeList.innerHTML = '';

    if (filteredEmployees.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="3" class="empty-message">No employees found matching your search.</td>`;
        employeeList.appendChild(row);
        return;
    }

    filteredEmployees.forEach((employee) => {
        const originalIndex = employees.findIndex(emp => emp.id === employee.id);
        const row = createEmployeeRow(employee, originalIndex);
        employeeList.appendChild(row);
    });
}

// Export employees to JSON (bonus feature)
function exportEmployees() {
    if (employees.length === 0) {
        showMessage("No employees to export", "error");
        return;
    }
    
    const dataStr = JSON.stringify(employees, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'employees.json';
    link.click();
    URL.revokeObjectURL(url);
}

// Make functions globally available
window.editEmployee = editEmployee;
window.deleteEmployee = deleteEmployee;
window.searchEmployees = searchEmployees;
window.exportEmployees = exportEmployees;