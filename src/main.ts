import mock from './MOCK_DATA.json'



const query = {
  logic: 'or',
  term: [
    {
      logic: 'and',
      term: [
        { "field": "first_name", "operator": "equal", "value": "Danette" },
        { "field": "last_name", "operator": "equal", "value": "Carnier" }
      ]
    },
    {
      logic: 'and',
      term: [
        { "field": "email", "operator": "equal", "value": "splumer2@imdb.com" },
        { "field": "gender", "operator": "equal", "value": "Male" },
      ]
    }
  ]
}

/**
 * 
 * /

/* where (
  (first_name='Danette') and (last_name='Carnier')
) or (
  email="splumer2@imdb.com" and gender = 'Non-binary'
) */


/* 
const resolveAndCondition = (term: any, row: any) => {
  return term.every((t: any) => {
    if ('logic' in t) {
      return executeQuery(t, row)
    } else {
      return row[t.field] == t.value
    }
  })
}

const resolveOrCondition = (term: any, row: any) => {
  return term.some((t: any) => {
    if ('logic' in t) {
      return executeQuery(t, row)
    } else {
      return resolveCondition(row.operator, row[t.field], t.value)
    }
  })
}
const resolveCondition = (operator: any, rowValue: any, value: any) => {
  switch (operator) {
    case '=':
      return rowValue == value;
    case '!=':
      return rowValue != value;
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
}

function executeQuery(query: any, row: any) {
  if ('logic' in query) {

    if (query.logic == 'and') {
      return resolveAndCondition(query.term, row)
    } else {
      return resolveOrCondition(query.term, row)
    }
  }
}
 */

const equalResolver = {
  operator:'equal',
  resolver:(rowValue: any, value: any)=>{
    return rowValue == value;
  }
}

const buildInResolvers = [
  equalResolver
]
class Filters {
  data = []
  queryObject:any
  resolvers = [
    ...buildInResolvers
  ]
  
  constructor() {}

  queryBuilder() { }

  private resolveCondition(operator: any, rowValue: any, value: any){
    const resolverObj = this.resolvers.filter(resolver=>{
      return resolver.operator == operator
    })
    if(resolverObj.length>0){
      resolverObj[0].resolver(rowValue,value)
    }else{
      return new Error('Non esiste un resolver con questo operatore '+operator)
    }
/*     switch (operator) {
      case '=':
        return rowValue == value;
      case '!=':
        return rowValue != value;
      case '>':
        return rowValue > value;
      case '<':
        return rowValue < value;
      case '>=':
        return rowValue >= value;
      case '<=':
        return rowValue <= value;
      default:
        return false; */
    }
  }

  private resolveAndCondition(term: any, row: any) {
    return term.every((t: any) => {
      if ('logic' in t) {
        return this.executeQueryOnRow(t, row)
      } else {
        return this.resolveCondition(t.operator, row[t.field], t.value)
      }
    })
  }
  private resolveOrCondition(term: any, row: any) {
    return term.some((t: any) => {
      if ('logic' in t) {     
        return this.executeQueryOnRow(t, row)
      } else {
        return this.resolveCondition(row.operator, row[t.field], t.value)
      }
    })
  }
  executeQuery() {
    if(this.data.length>0){
      const filtered = this.data.filter(row => {
        return this.executeQueryOnRow(this.queryObject,row)
      })
      return filtered
    }else{
      return 'error'
    }
  }
  private executeQueryOnRow(query: any, row: any) {
    if ('logic' in query) {
      if (query.logic == 'and') {
        return this.resolveAndCondition(query.term, row)
      } else {
        return this.resolveOrCondition(query.term, row)
      }
    }
  }

  setData(data:any) { 
    this.data = data
    return this
  }
  
  setQueryObject(query:any) {
    this.queryObject = query
    return this
  }
}
const filters = new Filters()

const filtered = filters.setData(mock).setQueryObject(query).executeQuery()

console.log(filtered)
