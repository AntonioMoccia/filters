import { equalResolver, notEqualResolver } from "./resolvers";

const buildInResolvers = [equalResolver, notEqualResolver];


interface CreateFilterOptions {
  filters: any[];
  data: any[];
  logic?: "and" | "or";
  watch?:boolean
  onFilterStateChange?:(filters:any)=>{}
}
interface Filter {
  initialState: {};
}

export function createFilter(options: CreateFilterOptions) {
  let filterInstance: any = {};

  options.logic = options.logic || "and";
  options.watch = options.watch || false;

  const { filters, data } = options;



  const mapInitialState = (filters: any) => {
    let filtersTmp: any = {
      filters: {},
    };
    filters.forEach((filter: any) => {
      filtersTmp.filters[filter.name] = filter.initialValue;
    });
    return filtersTmp;
  };

  filterInstance.initialState = filterInstance.state = {
    ...mapInitialState(filters),
  };

  const resolversBuildIn = [...buildInResolvers];

  const applyRowFilter = (row: any) => {
    if (options.logic == "and") {
      return options.filters.every((filter: any) => {
        if (typeof filter.operator == "function") {
          return filter.operator(
            row,
            filterInstance.state.filters[filter.name]
          );
        } else {
          return buildInResolvers
            .filter((resolver) => {
              return resolver.operator == filter.operator;
            })[0]
            .resolver(
              row[filter.field],
              filterInstance.state.filters[filter.name]
            );
        }
      });
    } else {
      return options.filters.some((filter: any) => {
        if (typeof filter.operator == "function") {
          return filter.operator(
            row,
            filterInstance.state.filters[filter.name]
          );
        } else {
          return buildInResolvers
            .filter((resolver) => {
              return resolver.operator == filter.operator;
            })[0]
            .resolver(
              row[filter.field],
              filterInstance.state.filters[filter.name]
            );
        }
      });
    }
  };

  const applyFilters = () => {
    filterInstance.currentData = data.filter((row) => {
      return applyRowFilter(row);
    });
  };

  const filtersInstance = {

    options:{
      ...options
    },

    getRows: () => {
      return filterInstance.currentData;
    },

    getState: () => {
      return filterInstance.initialState;
    },
    applyFilters: () => {
      applyFilters();
    },
    handleFilterChange: (
      filter_name: string,
      cb: (currentState: any) => any | any
    ) => {
      if(typeof cb =='function'){
        filterInstance.state.filters[filter_name] = cb(
          filterInstance.state.filters[filter_name]
        );
      }else{
        filterInstance.state.filters[filter_name] = cb
      }
      
      options.onFilterStateChange?.(filterInstance)

      if(options.watch){
        applyFilters();
      }
    },
  };
  Object.assign(filterInstance, filtersInstance);

  return filterInstance;
}
     