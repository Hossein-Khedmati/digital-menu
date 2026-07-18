export type Props = {
  action: () => Promise<{ success: boolean; error?: string }>;
  onDeleted: () => void;
  title?: string;
  description?: string;
};