import { apiRequest } from './apiClient.js';
import { usesMockApi } from '../config/env.js';
import { mockCategories } from '../data/mockCategories.js';

export const categoryService = {
  list:()=>usesMockApi ? Promise.resolve(mockCategories.filter(c=>c.isActive).sort((a,b)=>a.sortOrder-b.sortOrder)) : apiRequest('/api/categories'),
  getBySlug:slug=>usesMockApi ? Promise.resolve(mockCategories.find(c=>c.slug===slug) || null) : apiRequest(`/api/categories/${encodeURIComponent(slug)}`)
};

