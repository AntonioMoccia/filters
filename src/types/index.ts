export interface BaseQueryField<RowData> {
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

export type RowData = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  ip_address: string;
};
export type Query<RowData> = {
  logic: "or" | "and";
  term: Term<RowData>[];
};
