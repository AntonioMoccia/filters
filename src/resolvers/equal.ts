export const equalResolver = {
  operator: "equal",
  resolver: (rowValue: any, value: any) => {
    return rowValue == value;
  },
};
