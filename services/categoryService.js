import { apiRequest, normalizeListResponse, toQuery } from './apiClient.js';
import { usesMockApi } from '../config/env.js';
import { mockCategories } from '../data/mockCategories.js';

export const categoryService = {
  list:async params=>usesMockApi ? normalizeListResponse(mockCategories.filter(c=>c.isActive).sort((a,b)=>a.sortOrder-b.sortOrder),params) : normalizeListResponse(await apiRequest(`/api/categories${toQuery(params)}`),params),
  getBySlug:slug=>usesMockApi ? Promise.resolve(mockCategories.find(c=>c.slug===slug) || null) : apiRequest(`/api/categories/${encodeURIComponent(slug)}`)
};
