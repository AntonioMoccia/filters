import { equalResolver, notEqualResolver } from "./resolvers";
import { DeepKey, RowData } from "./types";
import { getNestedObject } from "./utils";

const buildInResolvers = [equalResolver, notEqualResolver];

interface CreateFilterOptions<TData extends RowData> {
  data: TData[];
  filters: Filter<TData>[];
  logic?: "and" | "or";
  watch?: boolean;
  onFilterStateChange?: (filters: any) => {};
}
export interface Filter<TData extends RowData> {
  value: {};
  field: DeepKey<TData>;
  operator: ((row: TData, state: any) => boolean) | string;
  name: string;
}

export function createFilter<TData extends RowData>(
  options: CreateFilterOptions<TData>
) {
  let filterInstance: any = {};

  options.logic = options.logic || "and";
  options.watch = options.watch || false;
  filterInstance.currentData = []
  
  const { filters, data } = options;

  const mapInitialState = (filters: any) => {
    let filtersTmp: any = {
      filters: {},
    };
    filters.forEach((filter: any) => {
      filtersTmp.filters[filter.name] = filter.value;
    });
    return filtersTmp;
  };

  filterInstance.initialState = filterInstance.state = {
    ...mapInitialState(filters),
  };

  const _resolvers = [...buildInResolvers];

  const applyRowFilter = (row: any) => {
    if (options.logic == "and") {
      return options.filters.every((filter: any) => {
        if (typeof filter.operator == "function") {
          return filter.operator(
            row,
            filterInstance.state.filters[filter.name]
          );
        } else {
          return filterInstance.options._resolvers
            .filter((resolver: any) => {
              return resolver.operator == filter.operator;
            })[0]
            .resolver(
              filter.field.includes(".")
                ? getNestedObject(row, filter.field)
                : row[filter.field],
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
          return filterInstance.options._resolvers
            .filter((resolver: any) => {
              return resolver.operator == filter.operator;
            })[0]
            .resolver(
              filter.field.includes(".")
                ? getNestedObject(row, filter.field)
                : row[filter.field],
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
    options: {
      _resolvers,
      ...options,
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
      if (typeof cb == "function") {
        filterInstance.state.filters[filter_name] = cb(
          filterInstance.state.filters[filter_name]
        );
      } else {
        filterInstance.state.filters[filter_name] = cb;
      }

      options.onFilterStateChange?.(filterInstance);

      if (options.watch) {
        applyFilters();
      }
    },
  };
  Object.assign(filterInstance, filtersInstance);

  return filterInstance;
}
