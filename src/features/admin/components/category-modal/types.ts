import { Tables } from "@/types/database.types";

export type Props = {
  restaurantId: string;
  category?: Tables<"categories">;
  onCreated?: (newCategory: Tables<"categories">) => void;
  onUpdated?: (updatedCategory: Tables<"categories">) => void;
};
