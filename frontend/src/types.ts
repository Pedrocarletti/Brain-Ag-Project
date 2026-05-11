export interface FieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'select';
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
}

export interface ColumnConfig<T> {
  header: string;
  render: (item: T) => string | number;
}
