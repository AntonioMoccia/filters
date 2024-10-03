import mock from "./MOCK_DATA.json";
import {
  BaseQueryField,
  EqualResolverField,
  NotEqualResolverField,
  Query,
  RowData,
  Term
} from './types'
import {Filters} from './Filter'

const query: Query<RowData> = {
  logic: "or",
  term: [
    {
      logic: "and",
      term: [
        { field: "first_name", operator: "equal", value: "Danette" },
        { field: "last_name", operator: "equal", value: "Carnier" },
        { field: "last_name", operator: "equal", value: "Carnier" },
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

const filters = new Filters();

const filtered = filters.setData(mock).setQueryObject(query).executeQuery();

console.log(filtered);

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
