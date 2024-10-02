import { equalResolver, notEqualResolver } from "./resolvers";




const buildInResolvers = [equalResolver, notEqualResolver];

export class Filters {
  data = [];
  queryObject: any;
  resolvers = [...buildInResolvers];

  constructor() {}

  queryBuilder() {}

  checkIfResolverAlreadyExist(newResolver: any) {
    return (
      this.resolvers.filter((resolver) => {
        return resolver.operator == newResolver.operator;
      }).length > 0
    );
  }

  addResolver(resolver: any) {
    if(this.checkIfResolverAlreadyExist(resolver)){
      throw new Error('esiste gia questo operatore')
    }else{
    } 
    this.resolvers.push(resolver);
    return this;
  }

  private resolveCondition(operator: any, rowValue: any, value: any) {
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
      if ("logic" in t) {
        return this.executeQueryOnRow(t, row);
      } else {
        return this.resolveCondition(t.operator, row[t.field], t.value);
      }
    });
  }

  private resolveOrCondition(term: any, row: any) {
    return term.some((t: any) => {
      if ("logic" in t) {
        return this.executeQueryOnRow(t, row);
      } else {
        return this.resolveCondition(row.operator, row[t.field], t.value);
      }
    });
  }
  executeQuery() {
    if (this.data.length > 0) {
      const filtered = this.data.filter((row) => {
        return this.executeQueryOnRow(this.queryObject, row);
      });
      return filtered;
    } else {
      return "error";
    }
  }
  private executeQueryOnRow(query: any, row: any) {
    if ("logic" in query) {
      if (query.logic == "and") {
        return this.resolveAndCondition(query.term, row);
      } else {
        return this.resolveOrCondition(query.term, row);
      }
    }
  }

  setData(data: any) {
    this.data = data;
    return this;
  }

  setQueryObject(query: any) {
    this.queryObject = query;
    return this;
  }
}
