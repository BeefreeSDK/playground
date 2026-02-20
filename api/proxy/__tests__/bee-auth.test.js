import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import handler from '../bee-auth.js';

vi.mock('axios');

describe('bee-auth endpoint', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    vi.clearAllMocks();

    mockReq = {
      method: 'POST',
      body: {},
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    // Set environment variables
    process.env.BEE_CLIENT_ID = 'test-client-id';
    process.env.BEE_CLIENT_SECRET = 'test-client-secret';
  });

  it('should return 405 for non-POST requests', async () => {
    mockReq.method = 'GET';

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(405);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
  });

  it('should authenticate successfully with default uid', async () => {
    const mockAuthResponse = {
      data: {
        token: 'test-token-123',
        access_token: 'access-token-456',
      },
    };

    axios.post.mockResolvedValue(mockAuthResponse);

    mockReq.body = {};

    await handler(mockReq, mockRes);

    expect(axios.post).toHaveBeenCalledWith(
      'https://auth.getbee.io/loginV2',
      {
        client_id: 'test-client-id',
        client_secret: 'test-client-secret',
        uid: 'demo-user',
      },
      { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
    );

    expect(mockRes.json).toHaveBeenCalledWith(mockAuthResponse.data);
  });

  it('should authenticate successfully with custom uid', async () => {
    const mockAuthResponse = {
      data: {
        token: 'test-token-789',
        access_token: 'access-token-012',
      },
    };

    axios.post.mockResolvedValue(mockAuthResponse);

    mockReq.body = { uid: 'custom-user-123' };

    await handler(mockReq, mockRes);

    expect(axios.post).toHaveBeenCalledWith(
      'https://auth.getbee.io/loginV2',
      {
        client_id: 'test-client-id',
        client_secret: 'test-client-secret',
        uid: 'custom-user-123',
      },
      { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
    );

    expect(mockRes.json).toHaveBeenCalledWith(mockAuthResponse.data);
  });

  it('should handle authentication errors', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    axios.post.mockRejectedValue(new Error('Network error'));

    mockReq.body = { uid: 'test-user' };

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to authenticate' });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Auth error:', {
      message: 'Network error',
      status: undefined,
      responseData: undefined,
      uid: 'test-user',
    });

    consoleErrorSpy.mockRestore();
  });

  it('should handle axios errors with response', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const axiosError = new Error('Request failed');
    axiosError.response = {
      status: 401,
      data: { message: 'Invalid credentials' },
    };

    axios.post.mockRejectedValue(axiosError);

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to authenticate' });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Auth error:', {
      message: 'Request failed',
      status: 401,
      responseData: { message: 'Invalid credentials' },
      uid: 'demo-user',
    });

    consoleErrorSpy.mockRestore();
  });

  it('should use environment variables for authentication', async () => {
    const mockAuthResponse = { data: { token: 'test' } };
    axios.post.mockResolvedValue(mockAuthResponse);

    process.env.BEE_CLIENT_ID = 'custom-client-id';
    process.env.BEE_CLIENT_SECRET = 'custom-secret';

    await handler(mockReq, mockRes);

    expect(axios.post).toHaveBeenCalledWith(
      'https://auth.getbee.io/loginV2',
      {
        client_id: 'custom-client-id',
        client_secret: 'custom-secret',
        uid: 'demo-user',
      },
      { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
    );
  });
});
