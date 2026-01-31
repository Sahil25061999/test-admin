// Configuration for authorized users who can access the API
// This file can be updated without restarting the server in development

export interface AuthorizedUser {
  phoneNumber: string;
  name: string;
  role: "admin" | "manager" | "operator";
  permissions: number[];
  lastAccess?: string;
}



type NavOption = {
  type: string;
  permission?: number;
};

type NavLink = {
  type: string;
  permission?: number;
  options?: NavOption;
};
// List of authorized phone numbers with additional metadata
export const AUTHORIZED_USERS: AuthorizedUser[] = [
  {
    phoneNumber: "8624800390",
    name: "Sujit Memane",
    role: "admin",
    permissions: [1, 3, 20, 21, 23],
  },
  {
    phoneNumber: "7507139592",
    name: "Admin User",
    role: "admin",
    permissions: [1, 3, 20, 21, 23],
  },
  {
    phoneNumber: "9450628820",
    name: "Admin User",
    role: "admin",
    permissions: [1, 3, 20, 21, 23],
  },
  {
    phoneNumber: "7010935074",
    name: "Admin User",
    role: "admin",
    permissions: [1, 3, 20, 21, 23],
  },
  {
    phoneNumber: "7401592702",
    name: "Admin User",
    role: "admin",
    permissions: [1, 3, 20, 21, 23],
  },
  {
    phoneNumber: "8144127115",
    name: "Admin User",
    role: "admin",
    permissions: [1, 3],
  },
  {
    phoneNumber: "8248399262",
    name: "Admin User",
    role: "admin",
    permissions: [1, 3],
  },
  {
    phoneNumber: "9841432183",
    name: "Admin User",
    role: "admin",
    permissions: [1, 3, 20, 21, 23],
  },
  {
    phoneNumber: "0000123456",
    name: "Admin User",
    role: "admin",
    permissions: [1, 2, 3, 10, 11, 12, 13, 14, 15, 20, 21, 22, 23, 24, 25, 30, 31, 32, 33, 34, 35, 40, 41, 42, 43, 50, 51, 60, 61, 62],
  },
  {
    phoneNumber: "0000000005",
    name: "Admin User",
    role: "admin",
    permissions: [1, 2, 3, 10, 11, 12, 13, 14, 20, 21, 22, 23, 24, 25, 30, 31, 32, 33, 34, 35, 40, 41, 42, 43, 50, 51, 60, 61],
  },
  {
    phoneNumber: "0000000009",
    name: "Admin User",
    role: "admin",
    permissions: [1, 2, 3, 10, 11, 12, 13, 20, 21, 22, 23, 24, 25, 30, 31, 32, 33, 34, 35, 40, 41, 42, 43, 50, 51, 60, 61],
  },
  {
    phoneNumber: "9025807876",
    name: "Admin User",
    role: "admin",
    permissions: [1, 2, 3, 10, 11, 12, 13, 14, 20, 21, 22, 23, 24, 25, 30, 31, 32, 33, 34, 35, 40, 41, 42, 43, 50, 51, 60, 61, 62],
  },
];

// Get all authorized phone numbers
export const getAuthorizedPhoneNumbers = (): string[] => {
  return AUTHORIZED_USERS.map((user) => user.phoneNumber);
};



export const getUserAuthorizedPages = (phoneNumber: string): number[] => {
  const user = getUserByPhoneNumber(phoneNumber);
  if (!user) return [];
  return user?.permissions
};



export const getAuthorizedNavLinks = (
  navLinks: NavLink[],
  userPermissions: number[]
): NavLink[] => {

  return navLinks
    .map((menu) => {

      if (menu.type === "link") {


        const isAllowed = userPermissions.includes(menu.permission)



        return isAllowed ? menu : null;
      }

      if (menu.type === "dropdown" && menu.options) {
        const allowedOptions = menu.options?.filter(option => {
          const allowed =
            !option.permission ||

            userPermissions.includes(option?.permission)

          return allowed;
        });

        if (allowedOptions.length === 0) {
          return null;
        }



        return {
          ...menu,
          options: allowedOptions,
        };
      }


      return null;
    })
    .filter((menu): menu is NavLink => Boolean(menu));
};



export const isPageAuthorized = (phoneNumber: string, permission: number): boolean => {
  const user = getUserByPhoneNumber(phoneNumber);
  if (!user) return false;
  return user.permissions.includes(permission);
}

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
