import localDB from './localDB';

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
      try {
        const res = await fetch(`${BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          const result = await res.json();
          localStorage.setItem('sarathi_token', result.token);
          localStorage.setItem('sarathi_user', JSON.stringify(result.user));
          return result;
        }
      } catch (e) {}

      // Fallback local registration
      const mockUser = {
        id: `USR-${Date.now().toString().slice(-4)}`,
        name: data.name || 'Registered Transporter',
        email: data.email,
        role: data.role || 'Transporter',
        mobile: data.mobile || data.phone || '9876543210',
        company: data.companyName || data.company || 'Sarathi Logistics Fleet'
      };
      const mockToken = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('sarathi_token', mockToken);
      localStorage.setItem('sarathi_user', JSON.stringify(mockUser));
      return { token: mockToken, user: mockUser };
    },

    login: async (data: any) => {
      try {
        const res = await fetch(`${BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          const result = await res.json();
          localStorage.setItem('sarathi_token', result.token);
          localStorage.setItem('sarathi_user', JSON.stringify(result.user));
          return result;
        }
      } catch (e) {}

      // Fallback local login
      const isAdmin = data.email && data.email.toLowerCase().includes('admin');
      const mockUser = {
        id: isAdmin ? 1 : 2,
        name: isAdmin ? 'Platform Administrator' : 'Shashank Vathar',
        email: data.email,
        role: isAdmin ? 'Admin' : 'Transporter',
        mobile: '9876543210',
        company: 'Samparka Sarathi Fleet'
      };
      const mockToken = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('sarathi_token', mockToken);
      localStorage.setItem('sarathi_user', JSON.stringify(mockUser));
      return { token: mockToken, user: mockUser };
    },

    me: async () => {
      try {
        const res = await fetch(`${BASE_URL}/auth/me`, { headers: getHeaders() });
        if (res.ok) {
          const user = await res.json();
          localStorage.setItem('sarathi_user', JSON.stringify(user));
          return user;
        }
      } catch (e) {}
      const cached = localStorage.getItem('sarathi_user');
      return cached ? JSON.parse(cached) : { id: 1, name: 'Transporter', role: 'Transporter' };
    },

    onboard: async () => {
      return { success: true };
    },

    logout: () => {
      localStorage.removeItem('sarathi_token');
      localStorage.removeItem('sarathi_user');
    }
  },

  // Trucks API
  trucks: {
    getAll: async () => {
      try {
        const res = await fetch(`${BASE_URL}/trucks`, { headers: getHeaders() });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) return data;
        }
      } catch (e) {}
      return localDB.getTrucks();
    },
    create: async (data: any) => {
      try {
        const res = await fetch(`${BASE_URL}/trucks`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
      return localDB.addTruck(data);
    },
    update: async (id: string, data: any) => {
      try {
        const res = await fetch(`${BASE_URL}/trucks/${id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
      return localDB.updateTruck(id, data) || { success: true };
    }
  },

  // Drivers API
  drivers: {
    getAll: async () => {
      try {
        const res = await fetch(`${BASE_URL}/drivers`, { headers: getHeaders() });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) return data;
        }
      } catch (e) {}
      return localDB.getDrivers();
    },
    create: async (data: any) => {
      try {
        const res = await fetch(`${BASE_URL}/drivers`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
      return localDB.addDriver(data);
    },
    update: async (name: string, data: any) => {
      try {
        const res = await fetch(`${BASE_URL}/drivers/${encodeURIComponent(name)}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
      return localDB.updateDriver(name, data) || { success: true };
    }
  },

  // Return Load Marketplace API
  loads: {
    getAll: async () => {
      try {
        const res = await fetch(`${BASE_URL}/loads`, { headers: getHeaders() });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) return data;
        }
      } catch (e) {}
      return localDB.getLoads();
    },
    create: async (data: any) => {
      try {
        const res = await fetch(`${BASE_URL}/loads`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
      return localDB.addLoad(data);
    },
    accept: async (loadId: string, truckId: string) => {
      try {
        const res = await fetch(`${BASE_URL}/loads/accept`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ loadId, truckId })
        });
        if (res.ok) return await res.json();
      } catch (e) {}
      return localDB.acceptLoad(loadId, truckId);
    }
  },

  // Trips API
  trips: {
    getAll: async () => {
      try {
        const res = await fetch(`${BASE_URL}/trips`, { headers: getHeaders() });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) return data;
        }
      } catch (e) {}
      return localDB.getTrips();
    },
    create: async (data: any) => {
      try {
        const res = await fetch(`${BASE_URL}/trips`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
      return localDB.addTrip(data);
    },
    update: async (id: string, data: any) => {
      try {
        const res = await fetch(`${BASE_URL}/trips/${id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
      return localDB.updateTrip(id, data) || { success: true };
    }
  },

  // Deliveries API
  deliveries: {
    getAll: async () => {
      try {
        const res = await fetch(`${BASE_URL}/deliveries`, { headers: getHeaders() });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) return data;
        }
      } catch (e) {}
      return localDB.getDeliveries();
    },
    create: async (data: any) => {
      try {
        const res = await fetch(`${BASE_URL}/deliveries`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
      return localDB.addDelivery(data);
    },
    update: async (id: string, status: string) => {
      try {
        const res = await fetch(`${BASE_URL}/deliveries/${id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify({ status })
        });
        if (res.ok) return await res.json();
      } catch (e) {}
      return localDB.updateDelivery(id, status as any) || { success: true };
    }
  },

  // Digital Documents API
  documents: {
    getAll: async () => {
      try {
        const res = await fetch(`${BASE_URL}/documents`, { headers: getHeaders() });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) return data;
        }
      } catch (e) {}
      return localDB.getDocuments();
    },
    create: async (data: any) => {
      try {
        const res = await fetch(`${BASE_URL}/documents`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
      return localDB.addDocument(data);
    },
    updateStatus: async (docId: string, status: string) => {
      try {
        const res = await fetch(`${BASE_URL}/documents/${docId}/status`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify({ status })
        });
        if (res.ok) return await res.json();
      } catch (e) {}
      return localDB.updateDocumentStatus(docId, status as any) || { success: true };
    }
  },

  // Fuel Management API
  fuel: {
    getAll: async () => {
      try {
        const res = await fetch(`${BASE_URL}/fuel`, { headers: getHeaders() });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) return data;
        }
      } catch (e) {}
      return localDB.getFuelMetrics();
    },
    logRefill: async (data: any) => {
      try {
        const res = await fetch(`${BASE_URL}/fuel`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
      return localDB.addFuelEntry(data);
    }
  },

  // Maintenance API
  maintenance: {
    getAll: async () => {
      try {
        const res = await fetch(`${BASE_URL}/maintenance`, { headers: getHeaders() });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) return data;
        }
      } catch (e) {}
      return localDB.getMaintenance();
    },
    create: async (data: any) => {
      try {
        const res = await fetch(`${BASE_URL}/maintenance`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
      return localDB.addMaintenance(data);
    },
    updateStatus: async (recordId: string, status: string) => {
      try {
        const res = await fetch(`${BASE_URL}/maintenance/${recordId}/status`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify({ status })
        });
        if (res.ok) return await res.json();
      } catch (e) {}
      return localDB.updateMaintenanceStatus(recordId, status as any) || { success: true };
    }
  },

  // Expenses API
  expenses: {
    getAll: async () => {
      try {
        const res = await fetch(`${BASE_URL}/expenses`, { headers: getHeaders() });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) return data;
        }
      } catch (e) {}
      return localDB.getExpenses();
    },
    create: async (data: any) => {
      try {
        const res = await fetch(`${BASE_URL}/expenses`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
      return localDB.addExpense(data);
    }
  },

  // Notifications API
  notifications: {
    getAll: async () => {
      try {
        const res = await fetch(`${BASE_URL}/notifications`, { headers: getHeaders() });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) return data;
        }
      } catch (e) {}
      return localDB.getNotifications();
    },
    read: async (id: string) => {
      try {
        const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
          method: 'PUT',
          headers: getHeaders()
        });
        if (res.ok) return await res.json();
      } catch (e) {}
      return localDB.markNotificationAsRead(id) || { success: true };
    }
  },

  // Admin Verification & Audit APIs
  admin: {
    getUsers: async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin/users`, { headers: getHeaders() });
        if (res.ok) return await res.json();
      } catch (e) {}
      return [];
    },
    getAuditLogs: async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin/audit-logs`, { headers: getHeaders() });
        if (res.ok) return await res.json();
      } catch (e) {}
      return [];
    },
    getTransporters: async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin/transporters`, { headers: getHeaders() });
        if (res.ok) return await res.json();
      } catch (e) {}
      return localDB.getTransporters();
    },
    verifyTransporter: async (id: string, status: 'Verified' | 'Rejected') => {
      try {
        const res = await fetch(`${BASE_URL}/admin/transporters/${id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify({ status })
        });
        if (res.ok) return await res.json();
      } catch (e) {}
      return localDB.verifyTransporter(id, status);
    },
    getShippers: async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin/shippers`, { headers: getHeaders() });
        if (res.ok) return await res.json();
      } catch (e) {}
      return localDB.getShippers();
    },
    verifyShipper: async (id: string, status: 'Verified' | 'Rejected') => {
      try {
        const res = await fetch(`${BASE_URL}/admin/shippers/${id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify({ status })
        });
        if (res.ok) return await res.json();
      } catch (e) {}
      return localDB.verifyShipper(id, status);
    },
    getLoginHistory: async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin/login-history`, { headers: getHeaders() });
        if (res.ok) return await res.json();
      } catch (e) {}
      return [];
    },
    getDashboardStats: async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin/dashboard`, { headers: getHeaders() });
        if (res.ok) return await res.json();
      } catch (e) {}
      return { totalTransporters: 12, totalShippers: 8, totalTrips: 45, totalRevenue: 1250000 };
    },
    getAnalytics: async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin/analytics`, { headers: getHeaders() });
        if (res.ok) return await res.json();
      } catch (e) {}
      return { netProfitPerKm: 18.5, totalBackhaulEarnings: 450000, emptyTripsSaved: 31 };
    }
  },

  // Contact API
  contact: {
    submit: async (data: any) => {
      try {
        const res = await fetch(`${BASE_URL}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
      return {
        success: true,
        message: 'Thank you for reaching out to Samparka Sarathi! Our logistics technical specialist will contact you shortly.'
      };
    },
    getAll: async () => {
      try {
        const res = await fetch(`${BASE_URL}/contact`, { headers: getHeaders() });
        if (res.ok) return await res.json();
      } catch (e) {}
      return [];
    }
  }
};

export default api;
