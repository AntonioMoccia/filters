export const notEqualResolver = {
  operator: "not_equal",
  resolver: (rowValue: any, value: any) => {
    return rowValue != value;
  },
};
