import mock from "./MOCK_DATA.json";
import { createFilter } from "./filter";


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


const {handleFilterChange} = createFilter({
  data: mock.slice(0, 100),
  logic: "and",
  filters,
  watch: true,
  onFilterStateChange:(filter)=>{
    console.log(filter);
  }
});
handleFilterChange('first_name','dane')