export type FilterChipOption = {
  value: string;
  label: string;
};

export type Props = {
  options: FilterChipOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};