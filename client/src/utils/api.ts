const BASE_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? `${window.location.origin}/api` : '/api');

// Helper to get auth header
const getHeaders = () => {
  const token = localStorage.getItem('sarathi_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // Authentication APIs
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
      localStorage.setItem('sarathi_token', result.token);
      localStorage.setItem('sarathi_user', JSON.stringify(result.user));
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
      localStorage.setItem('sarathi_token', result.token);
      localStorage.setItem('sarathi_user', JSON.stringify(result.user));
      return result;
    },

    me: async () => {
      const res = await fetch(`${BASE_URL}/auth/me`, { headers: getHeaders() });
      if (!res.ok) {
        throw new Error('Session unauthorized');
      }
      const user = await res.json();
      localStorage.setItem('sarathi_user', JSON.stringify(user));
      return user;
    },

    onboard: async () => {
      const res = await fetch(`${BASE_URL}/auth/onboard`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (!res.ok) {
        return { success: true };
      }
      return await res.json();
    },

    logout: () => {
      localStorage.removeItem('sarathi_token');
      localStorage.removeItem('sarathi_user');
    }
  },

  // Trucks API
  trucks: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/trucks`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch trucks from MySQL');
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
      if (!res.ok) throw new Error('Failed to update truck in MySQL');
      return await res.json();
    }
  },

  // Drivers API
  drivers: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/drivers`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch drivers from MySQL');
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
      const res = await fetch(`${BASE_URL}/drivers/${name}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update driver in MySQL');
      return await res.json();
    }
  },

  // Return Load Marketplace API
  loads: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/loads`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch return loads from MySQL');
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

  // Trips API
  trips: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/trips`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch trips from MySQL');
      return await res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${BASE_URL}/trips`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create trip in MySQL');
      return await res.json();
    },
    update: async (id: string, data: any) => {
      const res = await fetch(`${BASE_URL}/trips/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update trip in MySQL');
      return await res.json();
    }
  },

  // Deliveries API
  deliveries: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/deliveries`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch deliveries from MySQL');
      return await res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${BASE_URL}/deliveries`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create delivery in MySQL');
      return await res.json();
    },
    update: async (id: string, status: string) => {
      const res = await fetch(`${BASE_URL}/deliveries/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update delivery status in MySQL');
      return await res.json();
    }
  },

  // Digital Documents API
  documents: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/documents`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch digital documents from MySQL');
      return await res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${BASE_URL}/documents`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to upload document to MySQL');
      return await res.json();
    },
    updateStatus: async (docId: string, status: string) => {
      const res = await fetch(`${BASE_URL}/documents/${docId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update document status in MySQL');
      return await res.json();
    }
  },

  // Fuel Management API
  fuel: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/fuel`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch fuel metrics from MySQL');
      return await res.json();
    },
    logRefill: async (data: any) => {
      const res = await fetch(`${BASE_URL}/fuel`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to log fuel refill in MySQL');
      return await res.json();
    }
  },

  // Maintenance API
  maintenance: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/maintenance`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch maintenance records from MySQL');
      return await res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${BASE_URL}/maintenance`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to schedule maintenance in MySQL');
      return await res.json();
    },
    updateStatus: async (recordId: string, status: string) => {
      const res = await fetch(`${BASE_URL}/maintenance/${recordId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update maintenance status in MySQL');
      return await res.json();
    }
  },

  // Expenses API
  expenses: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/expenses`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch expenses from MySQL');
      return await res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${BASE_URL}/expenses`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create expense in MySQL');
      return await res.json();
    }
  },

  // Notifications API
  notifications: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/notifications`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch notifications from MySQL');
      return await res.json();
    },
    read: async (id: string) => {
      const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to mark notification read in MySQL');
      return await res.json();
    }
  },

  // Admin Verification & Audit APIs
  admin: {
    getUsers: async () => {
      const res = await fetch(`${BASE_URL}/admin/users`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch users from MySQL');
      return await res.json();
    },
    getAuditLogs: async () => {
      const res = await fetch(`${BASE_URL}/admin/audit-logs`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch audit logs from MySQL');
      return await res.json();
    },
    getTransporters: async () => {
      const res = await fetch(`${BASE_URL}/admin/transporters`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch transporters from MySQL');
      return await res.json();
    },
    verifyTransporter: async (id: string, status: 'Verified' | 'Rejected') => {
      const res = await fetch(`${BASE_URL}/admin/transporters/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to verify transporter in MySQL');
      return await res.json();
    },
    getShippers: async () => {
      const res = await fetch(`${BASE_URL}/admin/shippers`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch shippers from MySQL');
      return await res.json();
    },
    verifyShipper: async (id: string, status: 'Verified' | 'Rejected') => {
      const res = await fetch(`${BASE_URL}/admin/shippers/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to verify shipper in MySQL');
      return await res.json();
    },
    getLoginHistory: async () => {
      const res = await fetch(`${BASE_URL}/admin/login-history`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch login history from MySQL');
      return await res.json();
    },
    getDashboardStats: async () => {
      const res = await fetch(`${BASE_URL}/admin/dashboard`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch admin stats from MySQL');
      return await res.json();
    },
    getAnalytics: async () => {
      const res = await fetch(`${BASE_URL}/admin/analytics`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch analytics from MySQL');
      return await res.json();
    }
  },

  // Contact API
  contact: {
    submit: async (data: any) => {
      const res = await fetch(`${BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to submit contact message' }));
        throw new Error(err.error || 'Failed to submit contact message');
      }
      return await res.json();
    },
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/contact`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch contact inquiries from MySQL');
      return await res.json();
    }
  }
};

export default api;
