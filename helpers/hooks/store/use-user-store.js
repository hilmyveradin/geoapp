import { create } from "zustand";

const useUserStore = create((set) => ({
  isAdmin: false,
  isEditor: false,
  setUserRoles: (roles) =>
    set(() => ({
      isAdmin: roles.some((role) => {
        role.roleName.toLowerCase().includes("admin");
      }),
      isEditor: roles.some((role) =>
        role.roleName.toLowerCase().includes("editor")
      ),
    })),
}));

export default useUserStore;
