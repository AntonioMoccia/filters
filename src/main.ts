import mock from "./MOCK_DATA.json";
import {  createFilter } from "./filter";

const deepQuery: any = {
  logic: "or",
  term: [
    {
      logic: "and",
      term: [
        { field: "first_name", operator: "not_equal", value: "Danette" },
        { field: "last_name", operator: "equal", value: "Carnier" },
        { field: "last_name", operator: "equal", value: "Carnier" },
      ],
    },
    {
      logic: "and",
      term: [
        { field: "email", operator: "equal", value: "splumer2@imdb.com" },
        { field: "gender", operator: "equal", value: "Male" },
        { field: "gender", operator: "equal", value: "Male" },
      ],
    },
  ],
};

const {
  handleFilterChange,
  applyFilters,
  getRows
} = createFilter({
  data: mock,
  filters: [
    {
      name: "id",
      field: "id",
      operator: (row, state) => {
        if (!state.from || !state.to) return true;
        return row.id <= state.to && row.id >= state.from;
      },
      value: {
        from: undefined,
        to: undefined,
      },
    },
  ],
  logic: "and",
  watch: false,
  onFilterStateChange: async (filter) => {
    console.log(filter);
  },
});

handleFilterChange('id',{from : 1, to:9})

console.log(getRows());
