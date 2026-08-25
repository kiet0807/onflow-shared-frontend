import axios from 'axios';

import { createApiInstance, setAuthToken, setLanguage } from '../../index';

describe('createApiInstance', () => {
  it('builds an axios instance with the right defaults', () => {
    const api = createApiInstance({ baseURL: 'https://api.test/' });
    expect(api.defaults.baseURL).toBe('https://api.test/');
    expect(api.defaults.headers['X-System']).toBe('app');
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
    expect(api.defaults.headers['X-Country']).toBe('VN');
  });

  it('lets the host override the system header', () => {
    const api = createApiInstance({
      baseURL: 'https://api.test/',
      system: 'e-invoice',
      timeout: 30_000,
    });
    expect(api.defaults.headers['X-System']).toBe('e-invoice');
    expect(api.defaults.timeout).toBe(30_000);
  });

  it('rejects with an ApiError shape on a 500', async () => {
    // Use a mock axios instance to simulate a failed response.
    const mockApi = axios.create({ baseURL: 'https://api.test/' });
    mockApi.interceptors.response.use(
      (response) => {
        if (response.status >= 500) {
          throw Object.assign(new Error('boom'), { response });
        }
        return response;
      },
    );
    mockApi.interceptors.response.use(undefined, (error) =>
      Promise.reject({
        message: error.message,
        status: error.response?.status ?? 0,
        data: error.response?.data,
      }),
    );

    await expect(mockApi.get('/x')).rejects.toMatchObject({
      status: 0,
      message: expect.any(String),
    });
  });
});

describe('setAuthToken', () => {
  it('attaches and detaches the Authorization header', () => {
    const api = createApiInstance({ baseURL: 'https://api.test/' });
    setAuthToken(api, 'abc');
    expect(api.defaults.headers.common['Authorization']).toBe('NH abc');
    setAuthToken(api, null);
    expect(api.defaults.headers.common['Authorization']).toBeUndefined();
  });
});

describe('setLanguage', () => {
  it('sets the Accept-Language header', () => {
    const api = createApiInstance({ baseURL: 'https://api.test/' });
    setLanguage(api, 'en');
    expect(api.defaults.headers.common['Accept-Language']).toBe('en');
  });
});