import mock from './MOCK_DATA.json';
import {
  Query,
  RowData,
} from './types'
import { createFilters } from './Filter'

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

const appContainer =document.querySelector('#app')

const input = document.createElement('input')
input.name = 'first_name_1'

  appContainer?.appendChild(input)

const {
  handleStateChange,
  getState,
  getRows
} = createFilters<typeof mock[0]>({
  /*   _features:[], */
  watch:true,
  data: mock,
  filtersDef: [
    { name: 'first_name_1', field: "first_name", operator: 'not_equal', initialValue: "Danette" }
  ]
})
input.addEventListener('input',(e)=>{
  handleStateChange(e.currentTarget.name, (currentState) => e.currentTarget.value)
  console.log(getRows())
})


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
