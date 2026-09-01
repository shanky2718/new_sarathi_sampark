const BASE_URL = '/api';

const getHeaders = () => {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('sarathi_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  auth: {
    register: async (data: any) => {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Registration failed' }));
        throw new Error(errData.error || 'Registration failed');
      }
      const result = await res.json();
      if (typeof window !== 'undefined') {
        localStorage.setItem('sarathi_token', result.token);
        localStorage.setItem('sarathi_user', JSON.stringify(result.user));
      }
      return result;
    },

    login: async (data: any) => {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Login failed' }));
        throw new Error(errData.error || 'Login failed');
      }
      const result = await res.json();
      if (typeof window !== 'undefined') {
        localStorage.setItem('sarathi_token', result.token);
        localStorage.setItem('sarathi_user', JSON.stringify(result.user));
      }
      return result;
    },

    me: async () => {
      const res = await fetch(`${BASE_URL}/auth/me`, { headers: getHeaders() });
      if (!res.ok) {
        throw new Error('Session unauthorized');
      }
      const user = await res.json();
      if (typeof window !== 'undefined') {
        localStorage.setItem('sarathi_user', JSON.stringify(user));
      }
      return user;
    },

    onboard: async () => {
      return { success: true };
    },

    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sarathi_token');
        localStorage.removeItem('sarathi_user');
      }
    }
  },

  trucks: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/trucks`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch trucks');
      return await res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${BASE_URL}/trucks`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to add truck' }));
        throw new Error(err.error || 'Failed to add truck');
      }
      return await res.json();
    },
    update: async (id: string, data: any) => {
      const res = await fetch(`${BASE_URL}/trucks/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update truck');
      return await res.json();
    }
  },

  drivers: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/drivers`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch drivers');
      return await res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${BASE_URL}/drivers`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to add driver' }));
        throw new Error(err.error || 'Failed to add driver');
      }
      return await res.json();
    },
    update: async (name: string, data: any) => {
      const res = await fetch(`${BASE_URL}/drivers/${encodeURIComponent(name)}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update driver');
      return await res.json();
    }
  },

  loads: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/loads`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch return loads');
      return await res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${BASE_URL}/loads`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to post return load' }));
        throw new Error(err.error || 'Failed to post return load');
      }
      return await res.json();
    },
    accept: async (loadId: string, truckId: string) => {
      const res = await fetch(`${BASE_URL}/loads/accept`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ loadId, truckId })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to accept return load' }));
        throw new Error(err.error || 'Failed to accept return load');
      }
      return await res.json();
    }
  },

  trips: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/trips`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch trips');
      return await res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${BASE_URL}/trips`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create trip');
      return await res.json();
    },
    update: async (id: string, data: any) => {
      const res = await fetch(`${BASE_URL}/trips/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update trip');
      return await res.json();
    }
  },

  deliveries: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/deliveries`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch deliveries');
      return await res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${BASE_URL}/deliveries`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create delivery');
      return await res.json();
    },
    update: async (id: string, status: string) => {
      const res = await fetch(`${BASE_URL}/deliveries/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update delivery status');
      return await res.json();
    }
  },

  documents: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/documents`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch digital documents');
      return await res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${BASE_URL}/documents`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to upload document');
      return await res.json();
    },
    updateStatus: async (docId: string, status: string) => {
      const res = await fetch(`${BASE_URL}/documents/${docId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update document status');
      return await res.json();
    }
  },

  fuel: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/fuel`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch fuel metrics');
      return await res.json();
    },
    logRefill: async (data: any) => {
      const res = await fetch(`${BASE_URL}/fuel`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to log fuel refill');
      return await res.json();
    }
  },

  maintenance: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/maintenance`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch maintenance records');
      return await res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${BASE_URL}/maintenance`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to schedule maintenance');
      return await res.json();
    },
    updateStatus: async (recordId: string, status: string) => {
      const res = await fetch(`${BASE_URL}/maintenance/${recordId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update maintenance status');
      return await res.json();
    }
  },

  expenses: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/expenses`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch expenses');
      return await res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${BASE_URL}/expenses`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create expense');
      return await res.json();
    }
  },

  notifications: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/notifications`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch notifications');
      return await res.json();
    },
    read: async (id: string) => {
      const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to mark notification read');
      return await res.json();
    }
  },

  admin: {
    getUsers: async () => {
      const res = await fetch(`${BASE_URL}/admin/users`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch users');
      return await res.json();
    },
    getAuditLogs: async () => {
      const res = await fetch(`${BASE_URL}/admin/audit-logs`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch audit logs');
      return await res.json();
    },
    getTransporters: async () => {
      const res = await fetch(`${BASE_URL}/admin/transporters`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch transporters');
      return await res.json();
    },
    verifyTransporter: async (id: string, status: 'Verified' | 'Rejected') => {
      const res = await fetch(`${BASE_URL}/admin/transporters/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to verify transporter');
      return await res.json();
    },
    getShippers: async () => {
      const res = await fetch(`${BASE_URL}/admin/shippers`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch shippers');
      return await res.json();
    },
    verifyShipper: async (id: string, status: 'Verified' | 'Rejected') => {
      const res = await fetch(`${BASE_URL}/admin/shippers/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to verify shipper');
      return await res.json();
    },
    getLoginHistory: async () => {
      const res = await fetch(`${BASE_URL}/admin/login-history`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch login history');
      return await res.json();
    },
    getDashboardStats: async () => {
      const res = await fetch(`${BASE_URL}/admin/dashboard`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch admin stats');
      return await res.json();
    },
    getAnalytics: async () => {
      const res = await fetch(`${BASE_URL}/admin/analytics`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return await res.json();
    }
  }
};

export default api;
