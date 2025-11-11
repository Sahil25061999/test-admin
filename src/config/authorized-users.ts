// Configuration for authorized users who can access the API
// This file can be updated without restarting the server in development

export interface AuthorizedUser {
  phoneNumber: string;
  name: string;
  role: "admin" | "manager" | "operator";
  permissions: string[];
  lastAccess?: string;
}

// List of authorized phone numbers with additional metadata
export const AUTHORIZED_USERS: AuthorizedUser[] = [
  {
    phoneNumber: "7507139592",
    name: "Admin User",
    role: "admin",
    permissions: ["all"],
  },
  {
    phoneNumber: "9450628820",
    name: "Admin User",
    role: "admin",
    permissions: ["all"],
  },
  {
    phoneNumber: "7010935074",
    name: "Admin User",
    role: "admin",
    permissions: ["all"],
  },
  {
    phoneNumber: "7401592702",
    name: "Admin User",
    role: "admin",
    permissions: ["all"],
  },
  {
    phoneNumber: "8144127115",
    name: "Admin User",
    role: "admin",
    permissions: ["partial"],
  },
  {
    phoneNumber: "8248399262",
    name: "Admin User",
    role: "admin",
    permissions: ["partial"],
  },
  {
    phoneNumber: "9841432183",
    name: "Admin User",
    role: "admin",
    permissions: ["all"],
  },
  // Add more authorized users here
];

// Get all authorized phone numbers
export const getAuthorizedPhoneNumbers = (): string[] => {
  return AUTHORIZED_USERS.map((user) => user.phoneNumber);
};

// Check if a phone number is authorized
export const isPhoneNumberAuthorized = (phoneNumber: string): boolean => {
  return AUTHORIZED_USERS.some((user) => user.phoneNumber === phoneNumber);
};

// Get user details by phone number
export const getUserByPhoneNumber = (phoneNumber: string): AuthorizedUser | undefined => {
  return AUTHORIZED_USERS.find((user) => user.phoneNumber === phoneNumber);
};

// Check if user has specific permission
export const hasPermission = (phoneNumber: string, permission: string): boolean => {
  const user = getUserByPhoneNumber(phoneNumber);
  if (!user) return false;

  return user.permissions.includes("all") || user.permissions.includes(permission);
};

// Get all users with a specific role
export const getUsersByRole = (role: string): AuthorizedUser[] => {
  return AUTHORIZED_USERS.filter((user) => user.role === role);
};

// Add a new authorized user (for admin use)
export const addAuthorizedUser = (user: Omit<AuthorizedUser, "lastAccess">): void => {
  if (!AUTHORIZED_USERS.some((existing) => existing.phoneNumber === user.phoneNumber)) {
    AUTHORIZED_USERS.push({
      ...user,
      lastAccess: new Date().toISOString(),
    });
  }
};

// Remove an authorized user (for admin use)
export const removeAuthorizedUser = (phoneNumber: string): boolean => {
  const index = AUTHORIZED_USERS.findIndex((user) => user.phoneNumber === phoneNumber);
  if (index !== -1) {
    AUTHORIZED_USERS.splice(index, 1);
    return true;
  }
  return false;
};

// Update user's last access time
export const updateLastAccess = (phoneNumber: string): void => {
  const user = getUserByPhoneNumber(phoneNumber);
  if (user) {
    user.lastAccess = new Date().toISOString();
  }
};
