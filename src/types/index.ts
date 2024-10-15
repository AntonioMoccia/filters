export interface BaseQueryField<RowData> {
  name: string;
  field: keyof RowData;
}

export interface EqualResolverField<RowData> extends BaseQueryField<RowData> {
  operator: "equal";
  value: string;
}
export interface NotEqualResolverField<RowData>
  extends BaseQueryField<RowData> {
  operator: "not_equal";
  value: string;
}
export type Term<RowData> =
  | Query<RowData>
  | EqualResolverField<RowData>
  | NotEqualResolverField<RowData>;

export type RowData = unknown | object | any[];
export type Query<RowData> = {
  logic: "or" | "and";
  term: Term<RowData>[];
};
export type DeepKey<T> = T extends object
  ? {
      [K in keyof T]-?: K extends string | number
        ? `${K}` | `${K}.${DeepKey<T[K]>}`
        : never;
    }[keyof T]
  : never;


