import { Tables } from "@/types/database.types";

export type Props = {
  categories: Tables<"categories">[];
  activeCategory: string | null;
  slug: string;
  searchParams: Record<string, string | undefined>;
};