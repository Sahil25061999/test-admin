// Client-side API utility to replace direct external API calls
// This will route all calls through our server-side API routes

export const clientApi = {
  // Auth endpoints
  sendOtp: async (data: { countryCode: string; phone: string }) => {
    const response = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // User endpoints
  getUsers: async (params: {
    name?: string;
    phone?: string;
    txnid?: string;
    page?: string;
    limit?: string;
    status?: string;
    startdate?: string;
    enddate?: string;
  }) => {
    const searchParams = new URLSearchParams(params);
    const response = await fetch(`/api/users?${searchParams.toString()}`);
    return response.json();
  },

  getUserData: async (phone: string, type: "profile" | "wallet" | "buy-txn" | "gold-redemption") => {
    const response = await fetch(`/api/user/${phone}?type=${type}`);
    return response.json();
  },

  // Transaction endpoints
  getTransactions: async (params: {
    url: string;
    txn_type?: string;
    offset?: string;
    limit?: string;
    startdate?: string;
    enddate?: string;
    product_name?: string;
  }) => {
    const searchParams = new URLSearchParams(params);
    const response = await fetch(`/api/transactions?${searchParams.toString()}`);
    return response.json();
  },

  // Redemption endpoints
  executeRedemption: async (params: {
    action: "execute" | "cancel" | "process";
    product_name?: string;
    txn_id?: string;
    new_status?: string;
    notes?: string;
  }) => {
    const searchParams = new URLSearchParams(params);
    const response = await fetch(`/api/redemption?${searchParams.toString()}`);
    return response.json();
  },

  // Deposit endpoints
  deposit: async (data: { amount: number; phone: string; notes: string; type: "gold" | "silver" }) => {
    const response = await fetch("/api/deposit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Data endpoints
  getData: async (params: {
    action: "prices" | "convert";
    product?: string;
    block_id?: string;
    price_type?: string;
    input_val?: string;
    input_type?: string;
    product_type?: string;
  }) => {
    const searchParams = new URLSearchParams(params);
    const response = await fetch(`/api/data?${searchParams.toString()}`);
    return response.json();
  },

  // Discount endpoints
  createDiscount: async (data: { type: "offer" | "voucher"; [key: string]: any }) => {
    const response = await fetch("/api/discount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Invoice endpoints
  getInvoice: async (txnid: string) => {
    const response = await fetch(`/api/invoices/${txnid}`);
    return response.json();
  },

  // Stats endpoints
  getStats: async () => {
    const response = await fetch("/api/stats");
    return response.json();
  },

  // Wallet endpoints
  updateWallet: async (data: { phone_number: string; qty_g: number; product_name: "SILVER24" | "GOLD24" }) => {
    const response = await fetch("/api/wallet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Jewellery endpoints
  createJewellery: async (data: {
    title: string;
    description?: string;
    available_qty?: Record<string, number>;
    category: string;
    size?: number;
    gender?: string;
    meta?: Record<string, any>;
    images?: Array<{ image_url: string; order?: number; alt_text?: string | null }>;
    metal?: string;
  }) => {
    const response = await fetch("/api/jewellery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const jewelleryResponse = await response.json();
    console.log("create jewellery", jewelleryResponse);
    return jewelleryResponse;
  },

  updateJewellery: async (
    id: string,
    data: {
      title?: string;
      description?: string;
      available_qty?: Record<string, number>;
      category?: string;
      size?: number;
      gender?: string;
      factor?: number;
      meta?: Record<string, any>;
      images?: Array<{ image_url: string; order?: number; alt_text?: string | null }>;
    }
  ) => {
    const response = await fetch(`/api/jewellery/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteJewellery: async (id: string) => {
    const response = await fetch(`/api/jewellery/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },

  getJewellery: async (params: {
    metal_type: string;
    gender?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }) => {
    const searchParams = new URLSearchParams();
    searchParams.set("metal_type", params.metal_type);
    if (params.gender) searchParams.set("gender", params.gender);
    if (params.category) searchParams.set("category", params.category);
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.offset) searchParams.set("offset", params.offset.toString());
    const response = await fetch(`/api/jewellery?${searchParams.toString()}`);
    return response.json();
  },

  getJewelleryById: async (id: string) => {
    const response = await fetch(`/api/jewellery/${id}`);
    return response.json();
  },

  // Jewellery category endpoints
  createCategory: async (data: { category_name: string; metal: string; category_logo?: string }) => {
    const response = await fetch("/api/jewellery/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateCategory: async (
    id: string,
    data: {
      category_name?: string;
      metal?: string;
      category_logo?: string;
    }
  ) => {
    const response = await fetch(`/api/jewellery/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getCategories: async () => {
    const response = await fetch("/api/jewellery/categories");
    return response.json();
  },

  getCategoriesByMetalType: async (metal_type: string) => {
    const response = await fetch(`/api/jewellery/categories?metal_type=${metal_type}`);
    const data = await response.json();
    console.log("categories by metal type", data);
    return data;
  },

  // LMS Screen endpoints
  getScreenConfig: async (screen_name: string) => {
    const response = await fetch(`/api/lms/screen/${screen_name}`);
    return response.json();
  },

  updateScreenConfig: async (
    screen_name: string,
    config_data: {
      priorityList?: string[];
      sections?: Record<string, any>;
    }
  ) => {
    const response = await fetch(`/api/lms/screen/${screen_name}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config_data),
    });
    return response.json();
  },
};
