/**
 * 
 creare array di filtri

 creare la logica che esegue gli array dei filtri in sequnza per ogni riga dell'array

 ogni filtro avrà il valore di default, il field (se è annidato "field.subfield") e il valore attuale e l'id
  ogni filtro dovràa avere i metodi per aggiornare il valore attuale dei filtri e per validare l'oggetto



  Filtro: 
    id o name
    initialValue,
    setFilterValue
    type search-filter,range-filter,date-filter
 */

/**
 *
 * per esempio devo poter eseguire il filtraggio su un elenco
 */
import data from "./MOCK_DATA.json";

interface Filter {
  name: string;
  field: string;
  filterState?: Record<string, any>;
  filter: ((row: any,field:keyof DataRow, actualFilterState: any) => boolean ) | string;

}
type DataRow = (typeof data)[0];
type Data = DataRow[];

interface filterCoreState<TData> {
  data: TData[] | [];
  filters: any[];
  filterStates: Record<string, any>;
}
interface FilterBuild {
  filterState: Record<string, any>;
  filter: (row: any,field:keyof DataRow, actualFilterState: any) => boolean;
}

let state: filterCoreState<DataRow> = {
  filters: [],
  data: [],
  filterStates: {},
};



/**
 * FilterDef
 * 
 * Filter
 * 
 * State
 * 
 * 
 */

const endsWithFilter: FilterBuild = {
  filterState: {
    query: "e",
  },
  filter: (row,field, actualFilterState) => {
    return (row[field] as string).endsWith(actualFilterState.query);
  },
};

const filterDefs: Filter[] = [
  {
    name: "search",
    field: "first_name",
    filterState: {
      query: "Cath",
    },
    filter: (row: (typeof data)[0],field, actualFilterState: any) => {
      return row[field].toString().trim().includes(actualFilterState.query);
    },
  },
  {
    name: "search_ends_with",
    field: "first_name",
    filter: "ends-with",
  },
];

//const updateFilterValue = (id, fieldUpadate, value, filterStates) => {};

const buildInFilters: Record<string, FilterBuild> = {
  "ends-with": endsWithFilter,
};

const createFilters = (filterDefs: Filter[], data: Data) => {
  filterDefs.forEach((filter) => {
    if (typeof filter.filter == "function") {
      state.filterStates = {
        ...state.filterStates,
        [filter.name]: { ...filter.filterState },
      };
      state.filters.push({
        filter: filter.filter,
        name: filter.name,
        field: filter.field,
      });
    } else {
      if (buildInFilters[filter.filter]) {
        state.filters.push({
          name: filter.name,
          field: filter.field,
          filter: buildInFilters[filter.filter].filter,
        });
        state.filterStates = {
          ...state.filterStates,
          [filter.name]:{...buildInFilters[filter.filter].filterState}
        }

      }

      buildInFilters[filter.filter];
    }

    state.data = [...data];
  });
};
/**
 * 
 * @param filterName 
 * @param data 
 * @param stateFilter
 * 
 * 
 * da cambiare passando gli array di filtri che cambiano 
 */
const applyFilters = (filterName, data, stateFilter: typeof state) => {
  const filtered = data.filter((row) => {
    return state.filters.every((filter) => {
      const filterName: string = filter.name;
      //      const exits = Object.keys(state.filterStates).includes(filterName)
      console.log(filter.filter(row, filter.field,stateFilter.filterStates[filterName]))
      return filter.filter(row, filter.field,stateFilter.filterStates[filterName]);
    });
  });

  state.data = {...filtered}
};

createFilters(filterDefs, data);
applyFilters("search", data, state);
console.log(state);
