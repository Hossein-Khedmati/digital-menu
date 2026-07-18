import { Tables } from "@/types/database.types";

export type Props = {
  categories: Tables<"categories">[];
  restaurantId: string;
};

export type RowProps = {
  category: Tables<"categories">;
  restaurantId: string;
  isSearching: boolean;
  onUpdated: (cat: Tables<"categories">) => void;
  onDeleted: (id: string) => void;
};

export type RowPropsWithoutSearch = Omit<RowProps, 'isSearching'>;