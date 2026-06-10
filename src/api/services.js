// services.js
// Ee file lo — ANNI API calls untayi!
// Pages lo direct axios raayakkarledu — ikkade nundi import chestam

import API from './axiosConfig';

// ==================== USER APIs ====================

// Register — new user create cheyyadaniki
export const registerUser = (userData) => {
  return API.post('/users/register', userData);
};

// Login — userId tiskoni localStorage lo pettukuntam
export const loginUser = (credentials) => {
  return API.post('/users/login', credentials);
};

// Get user by ID
export const getUserById = (userId) => {
  return API.get(`/users/${userId}`);
};

// ==================== GROUP APIs ====================

// New group create cheyyadaniki
export const createGroup = (groupData) => {
  return API.post('/groups', groupData);
};

// Group details — oka group info
export const getGroupById = (groupId) => {
  return API.get(`/groups/${groupId}`);
};

// User's anni groups — Dashboard lo use avutundi
export const getGroupsByUserId = (userId) => {
  return API.get(`/groups/user/${userId}`);
};

// ==================== EXPENSE APIs ====================

// New expense add cheyyadaniki
export const addExpense = (expenseData) => {
  return API.post('/expenses', expenseData);
};

// Group lo anni expenses
export const getExpensesByGroup = (groupId) => {
  return API.get(`/expenses/group/${groupId}`);
};

// ==================== BALANCE APIs ====================

// Group lo who owes whom
export const getBalancesByGroup = (groupId) => {
  return API.get(`/balances/group/${groupId}`);
};

// Settle up — debt clear cheyyadaniki
export const settleBalance = (settleData) => {
  return API.post('/balances/settle', settleData);
};