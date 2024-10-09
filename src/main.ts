import mock from "./MOCK_DATA.json";
import { createFilter } from "./Filter";

const deepQuery: any = {
  logic: "or",
  term: [
    {
      logic: "and",
      term: [
        { field: "first_name", operator: "not_equal", value: "Danette" },
        { field: "last_name", operator: "equal", value: "Carnier" },
      ],
    },
    {
      logic: "and",
      term: [
        { field: "email", operator: "equal", value: "splumer2@imdb.com" },
        { field: "gender", operator: "equal", value: "Male" },
      ],
    },
  ],
};

const filters = [
  {
    name: "id",
    field: "id",
    operator: (row, state) => {
      return row.id <= state.to && row.id >= state.from;
    },
    initialValue: {
      from: undefined,
      to: undefined,
    },
  },
  {
    name: "first_name",
    field: "first_name",
    operator: "equal",
    initialValue: "Danette",
  },
];


const filter = createFilter({
  filters,
  data: mock.slice(0, 100),
  logic: "and",
  watch: true
});
