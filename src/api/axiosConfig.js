// axiosConfig.js
// Ee file — meeru backend tho matladataniki base URL set chestundi
// Prathi API call ki http://localhost:8081 type cheyakkarledu — ikkade set aipothundi!

import axios from 'axios';

const API = axios.create({
  baseURL: 'http://split-expense-backend-iemv.onrender.com/api',  // ← Meeru Spring Boot running ikkade!
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;