import { equalResolver, notEqualResolver } from "./resolvers";

const buildInResolvers = [equalResolver, notEqualResolver];
interface FilterProps {
  filters: any
}
export class Filter<RowData> {
  data = [];
  queryObject: any;
  resolvers = [...buildInResolvers];
  state:any = {};
  filters:any ;
  constructor({ filters }: FilterProps) {
    this.filters = filters
    this.initState()
  }

  queryBuilder() { }

  checkIfResolverAlreadyExist(newResolver: any) {
    return (
      this.resolvers.filter((resolver) => {
        return resolver.operator == newResolver.operator;
      }).length > 0
    );
  }

  addResolver(resolver: any) {
    if (this.checkIfResolverAlreadyExist(resolver)) {
      throw new Error('esiste gia questo operatore')
    } else {
    }
    this.resolvers.push(resolver);
    return this;
  }

  private resolveCondition(operator: any, rowValue: any, value: any) {
    if(){
      
    }
    const resolverObj = this.resolvers.filter((resolver) => {
      return resolver.operator == operator;
    });
    if (resolverObj.length > 0) {
      return resolverObj[0].resolver(rowValue, value);
    } else {
      throw new Error(
        "Non esiste un resolver con questo operatore " + operator
      );
    }
  }

  private resolveAndCondition(term: any, row: any) {
    return term.every((t: any) => {
      return this.resolveCondition(t.operator, row[t.field], t.value);
    });
  }

  private resolveOrCondition(term: any, row: any) {
    return term.some((t: any) => {
      return this.resolveCondition(t.operator, row[t.field], t.value);
    });
  }


  executeQuery() {
    return this.data.filter(row => {
      if (this.queryObject?.logic == 'and') {
        return this.resolveAndCondition(this.queryObject.term, row)
      } else {
        return this.resolveOrCondition(this.queryObject.term, row)
      }
    })
  }

  setData(data: any) {
    this.data = data;
    return this;
  }
  setInitialState() {
    this.queryObject.term.map((term: any) => {
      console.log(term);

    })
  }
  setState(fieldName:string,value:any){ 

  }
  checkIfFilterExist(filterName:string){
    return Object.keys(this.state).includes(filterName)
  }
  initState() {
    this.filters.forEach((query:any)=>{
      console.log(this.checkIfFilterExist(query.name));
      
        if(this.checkIfFilterExist(query.name)){
          throw new Error(`filterName deve essere univoco: ${query.name}`)
        }else{
          this.state[query.name] = query.initialValue
        }
    })
  }
  getState(){
    return this.state
  }
  handleFieldChange(field: string, newState: any) {
    this.state[field] = newState
  }

}

