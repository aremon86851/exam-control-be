export type IAutocompleteOption = {
  id: string;
  label: string;
  value: string;
};

export type IAutocompleteQuery = {
  q?: string;
  limit?: number;
  filters?: Record<string, any>;
  roles?: string;
};
