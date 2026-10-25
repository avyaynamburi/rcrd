import type { Database, Json } from "./database.types";
/** Migration contract; generated schema remains the base for all existing APIs. */
export type AccessDatabase = Database & {
  public: {
    Functions: {
      list_member_access: {
        Args: Record<string, never>;
        Returns: { id: string; access_grid: Json }[];
      };
      set_member_access: {
        Args: { target_membership_id: string; new_grid: Json };
        Returns: undefined;
      };
    };
  };
};
