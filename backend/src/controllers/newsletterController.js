import { mockDataService } from '../services/mockDataService.js';

export function subscribe(req, res) {
  res.status(201).json({
    success: true,
    message: 'Kaydınız alındı. Aramıza hoş geldiniz.',
    subscriber: mockDataService.subscribeNewsletter(req.body)
  });
}
