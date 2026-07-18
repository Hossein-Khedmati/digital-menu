import { Tables } from "@/types/database.types";

export type Props = {
  restaurantId: string;
  userId: string;
  categories: Tables<"categories">[];
  item?: Tables<"menu_items">;
  onCreated?: (newItem: Tables<"menu_items">) => void;
  onUpdated?: (updatedItem: Tables<"menu_items">) => void;
};
