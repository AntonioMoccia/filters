import {
  equalResolver,
  notEqualResolver
} from './resolvers'
interface FilterDef<RowData> {
  name: string,
  operator: string,
  initialValue: any
  field: keyof RowData
}
interface CreateFiltersProps<RowData> {
  filtersDef: FilterDef<RowData>[]
  data: RowData[]
}

const resolversBuildIn = [equalResolver, notEqualResolver]
//feature.getInitialState() return obj to add to state of filters qith feature name
export function createFilters<RowData>(options: CreateFiltersProps<RowData>): any {
  let filter = {}
  const _resolvers = [...resolversBuildIn]
  options.logic = options.logic || 'and'
  filter = { _resolvers }
  let initialState: any = {}
  let rows: [] | RowData[] = []
  options.filtersDef.forEach((filter: FilterDef<RowData>) => {
    initialState[filter.name] = filter.initialValue
  });
  let state = { ...initialState }
  filter = { ...filter, state }


  const getOperatorFromBuildIn = (operator) => {
    return _resolvers.filter(resolver => resolver.operator == operator)[0].resolver
  }

  const getOperator = (filter: FilterDef<RowData>) => {
    if (typeof filter.operator == 'function') {
      return filter.operator
    } else {
      return getOperatorFromBuildIn(filter.operator)
    }
  }
  const setRows = (newRows) => {
    rows = [...newRows]
  }

  const applyFilters = () => {
    if (options.logic == 'and') {
      setRows(options.data.filter(applyAndCondition))
    } else {
      setRows(options.data.filter(applyOrCondition))
    }
  }
  const getRows = () => {
    return rows
  }
  const applyAndCondition = (row: RowData) => {
    return options.filtersDef.every(currentFilter => {
      const operator = getOperator(currentFilter)
      const stateValue = filter.state[currentFilter.name]
      return operator(row[currentFilter.field], stateValue)
    })
  }
  const applyOrCondition = (row: RowData) => {
    return options.filtersDef.some(currentFilter => {
      const operator = getOperator(currentFilter)
      const stateValue = filter.state[currentFilter.name]
      return operator(row[currentFilter.field], stateValue)
    })
  }

  let filterInstance = {
    options: {
      ...options
    },
    rows,
    
    getState: () => {
      return filter.state
    },
    handleStateChange: (filterName: string, cb: (state: any) => any) => {
      filter.state[filterName] = cb(filter.state)
      if (options.watch) { applyFilters() } else { return }
    },
    applyFilters,
    getRows
  }

  Object.assign(filter, filterInstance)

  return filter

} 