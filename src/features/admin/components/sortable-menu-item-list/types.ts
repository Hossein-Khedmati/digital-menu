import { Tables } from "@/types/database.types";

export type MenuItemWithCategory = Tables<"menu_items"> & {
  categories: { name: string; icon: string | null } | null;
};

export type Props = {
  items: MenuItemWithCategory[];
  categories: Tables<"categories">[];
  restaurantId: string;
  userId: string;
};
export type ItemRowProps = {
  item: MenuItemWithCategory;
  restaurantId: string;
  userId: string;
  categories: Tables<"categories">[];
  isSearching: boolean;
  onUpdated: (updatedItem: Tables<"menu_items">) => void;
  onDeleted: (id: string) => void;
};

export type ItemRowPropsWithoutSearch = Omit<ItemRowProps, "isSearching">;
