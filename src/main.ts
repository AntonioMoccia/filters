import mock from './MOCK_DATA.json';
import {
  Query,
  RowData,
} from './types'
import { Filter } from './Filter'

const deepQuery: Query<RowData> = {
  logic: "or",
  term: [
    {
      logic: "and",
      term: [
        { field: "first_name", operator: "not_equal", value: "Danette" },
        { field: "last_name", operator: "equal", value: "Carnier" }
      ],
    },
    {
      logic: "and",
      term: [
        { field: "email", operator: "equal", value: "splumer2@imdb.com" },
        { field: "gender", operator: "equal", value: "Male" }
      ],
    }
  ],
};

const filters = [
  { name: 'first_name_1', field: "first_name", operator: 'not_equal', initialValue: "Danette" },
  { name: 'first_name_2', field: "first_name", operator: 'not_equal', initialValue: "Danettefdsfsdfsfdsdfg" },
  { name: 'first_name_3', field: "first_name", operator: 'not_equal', initialValue: "Danette" },
  { name: 'first_name_4', field: "first_name", operator: 'not_equal', initialValue: "Danette" }
]
 
const filter = new Filter({filters})


console.log(filter.getState());

//const filters = new Filter();
//combineFilters(filters)

//const filtered = filters.setQueryObject(query).setData(mock.slice(0, 100))

/* 
const filtersDefs = [
  {
    name:''
    initialValue:'',
    operator:'equal'
    operatorFn:()=>{

    },

  }
]  */


/* 
combineFilters(filters,filters1,filters2) */
/*     switch (operator) {

      case '>':
        return rowValue > value;
      case '<':
        return rowValue < value;
      case '>=':
        return rowValue >= value;
      case '<=':
        return rowValue <= value;
      default:
        return false; 
      }
      */
