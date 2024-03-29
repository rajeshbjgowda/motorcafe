export const SUPER_ADMIN = "super-admin";

export const ADMIN = "admin";

export const USER_TYPES = {
  "super-admin": {
    label: "Super Admin",
    value: SUPER_ADMIN,
    collection: "super_admins",
  },
  admin: {
    label: "Admin",
    value: ADMIN,
    collection: "admins",
  },
};


export const errorToastOption = {
  appearance: "error",
  autoDismiss: true,
  placement: "bottom-center",
};

export const successToastOption = {
  appearance: "success",
  autoDismiss: true,
  placement: "bottom-center",
};
