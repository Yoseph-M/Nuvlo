import { getAccessToken, authClient } from "./auth-client";

const API_BASE_URL = import.meta.env.VITE_API_URL || ""; // Will be resolved at runtime

// Generic fetch function with error handling and JSON parsing
const fetcher = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  try {
    const accessToken = getAccessToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    let response = await fetch(`${API_BASE_URL}${url}`, {
      headers,
      credentials: "include", // Include cookies for session/auth
      ...options,
    });

    // Handle expired access tokens automatically by trying a silent token refresh
    if (response.status === 401 && !url.includes("/api/auth/refresh") && !url.includes("/api/auth/login") && !url.includes("/api/auth/register")) {
      console.log(`[API] Received 401 from ${url}, attempting silent refresh...`);
      const refreshed = await authClient.silentRefresh();

      if (refreshed) {
        const newAccessToken = getAccessToken();
        const retryHeaders = {
          ...headers,
        };
        if (newAccessToken) {
          retryHeaders["Authorization"] = `Bearer ${newAccessToken}`;
        }

        console.log(`[API] Silent refresh succeeded. Retrying request to ${url}...`);
        response = await fetch(`${API_BASE_URL}${url}`, {
          headers: retryHeaders,
          credentials: "include",
          ...options,
        });
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData: { name: string; email: string; password: string; role?: "guest" | "host" | "admin" }) =>
    fetcher<{ _id: string; name: string; email: string; role: string; token: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (credentials: { email: string; password: string }) =>
    fetcher<{ _id: string; name: string; email: string; role: string; token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  logout: () => fetcher<{ message: string }>("/api/auth/logout", { method: "POST" }),

  getProfile: () => fetcher<{ _id: string; name: string; email: string; role: string }>("/api/auth/profile"),
};

// Properties API
export const propertiesAPI = {
  getAll: () => fetcher<any[]>("/api/properties"),
  
  getById: (id: string) => fetcher<any>(`/api/properties/${id}`),
  
  create: (propertyData: any) =>
    fetcher<any>("/api/properties", {
      method: "POST",
      body: JSON.stringify(propertyData),
    }),
  
  update: (id: string, propertyData: any) =>
    fetcher<any>(`/api/properties/${id}`, {
      method: "PUT",
      body: JSON.stringify(propertyData),
    }),
  
  delete: (id: string) =>
    fetcher<{ message: string }>(`/api/properties/${id}`, {
      method: "DELETE",
    }),
};

// Bookings API
export const bookingsAPI = {
  getAll: () => fetcher<any[]>("/api/bookings"),
  
  getById: (id: string) => fetcher<any>(`/api/bookings/${id}`),
  
  create: (bookingData: any) =>
    fetcher<any>("/api/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData),
    }),
  
  update: (id: string, bookingData: any) =>
    fetcher<any>(`/api/bookings/${id}`, {
      method: "PUT",
      body: JSON.stringify(bookingData),
    }),
  
  delete: (id: string) =>
    fetcher<{ message: string }>(`/api/bookings/${id}`, {
      method: "DELETE",
    }),
};

// Payments API
export const paymentsAPI = {
  getAll: () => fetcher<any[]>("/api/payments"),
  
  getById: (id: string) => fetcher<any>(`/api/payments/${id}`),
  
  create: (paymentData: any) =>
    fetcher<any>("/api/payments", {
      method: "POST",
      body: JSON.stringify(paymentData),
    }),
  
  update: (id: string, paymentData: any) =>
    fetcher<any>(`/api/payments/${id}`, {
      method: "PUT",
      body: JSON.stringify(paymentData),
    }),
  
  delete: (id: string) =>
    fetcher<{ message: string }>(`/api/payments/${id}`, {
      method: "DELETE",
    }),
};

// Reviews API
export const reviewsAPI = {
  getAll: () => fetcher<any[]>("/api/reviews"),
  
  getById: (id: string) => fetcher<any>(`/api/reviews/${id}`),
  
  create: (reviewData: any) =>
    fetcher<any>("/api/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    }),
  
  update: (id: string, reviewData: any) =>
    fetcher<any>(`/api/reviews/${id}`, {
      method: "PUT",
      body: JSON.stringify(reviewData),
    }),
  
  delete: (id: string) =>
    fetcher<{ message: string }>(`/api/reviews/${id}`, {
      method: "DELETE",
    }),
};

// Messages API
export const messagesAPI = {
  getAll: () => fetcher<any[]>("/api/messages"),
  
  getById: (id: string) => fetcher<any>(`/api/messages/${id}`),
  
  create: (messageData: any) =>
    fetcher<any>("/api/messages", {
      method: "POST",
      body: JSON.stringify(messageData),
    }),
  
  update: (id: string, messageData: any) =>
    fetcher<any>(`/api/messages/${id}`, {
      method: "PUT",
      body: JSON.stringify(messageData),
    }),
  
  delete: (id: string) =>
    fetcher<{ message: string }>(`/api/messages/${id}`, {
      method: "DELETE",
    }),
};

// Health check
export const healthAPI = {
  check: () => fetcher<{ message: string }>("/"),
};
