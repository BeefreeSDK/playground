import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

vi.mock('axios', () => {
  const mockPost = vi.fn();
  return {
    default: {
      create: vi.fn(() => ({
        post: mockPost,
      })),
      post: mockPost,
    },
  };
});

describe('api service', () => {
  let mockApi: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Reset the module to get a fresh instance
    vi.resetModules();
    mockApi = (await import('../api')).default;
  });

  describe('authAPI', () => {
    describe('getToken', () => {
      it('should get authentication token with default uid', async () => {
        const mockResponse = { data: { token: 'test-token-123' } };
        mockApi.post = vi.fn().mockResolvedValue(mockResponse);

        const { authAPI } = await import('../api');
        const result = await authAPI.getToken();

        expect(mockApi.post).toHaveBeenCalledWith('/proxy/bee-auth', { uid: 'demo-user' });
        expect(result).toEqual({ token: 'test-token-123' });
      });

      it('should get authentication token with custom uid', async () => {
        const mockResponse = { data: { token: 'custom-token-456' } };
        mockApi.post = vi.fn().mockResolvedValue(mockResponse);

        const { authAPI } = await import('../api');
        const result = await authAPI.getToken('custom-user');

        expect(mockApi.post).toHaveBeenCalledWith('/proxy/bee-auth', { uid: 'custom-user' });
        expect(result).toEqual({ token: 'custom-token-456' });
      });

      it('should handle authentication errors', async () => {
        mockApi.post = vi.fn().mockRejectedValue(new Error('Auth failed'));

        const { authAPI } = await import('../api');

        await expect(authAPI.getToken()).rejects.toThrow('Auth failed');
      });
    });
  });
});
