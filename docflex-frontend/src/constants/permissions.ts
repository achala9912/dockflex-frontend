// frontend/constants/permissions.ts
export const PERMISSIONS = {
  // User permissions
  USER_CREATE: "user:create",
  USER_READ: "user:read",
  USER_UPDATE: "user:update",
  USER_DELETE: "user:delete",

  // Role permissions
  ROLE_CREATE: "role:create",
  ROLE_READ: "role:read",
  ROLE_UPDATE: "role:update",
  ROLE_DELETE: "role:delete",

  // Medical Center permissions
  CENTER_CREATE: "center:create",
  CENTER_READ: "center:read",
  CENTER_UPDATE: "center:update",
  CENTER_DELETE: "center:delete",

  // Patient permissions
  PATIENT_MANAGEMENT: "patient:management",

  // Session permissions
  SESSION_MANAGEMENT: "session:management",

  // Generic Name permissions
  GENERICNAME_MANAGEMENT: "generic:management",

  // Appointment permissions
  APPOINTMENT_MANAGEMENT: "appointment:management",

  // Product permissions
  PRODUCT_MANAGEMENT: "product:management",

  // Prescription permissions
  PRESCRIPTION_CREATE: "prescription:create",
  PRESCRIPTION_CANCEL: "prescription:cancel",
  PRESCRIPTION_UPDATE: "prescription:update",
  PRESCRIPTION_READ: "prescription:read",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Default roles (optional for frontend reference)
export const DEFAULT_ROLES = [
  {
    roleName: "SystemAdmin",
    permissions: Object.values(PERMISSIONS),
  },
];

export const isPermitted = (
  userPermissions: string[],
  requiredPermission?: string
) => !requiredPermission || userPermissions.includes(requiredPermission);


export default PERMISSIONS;
