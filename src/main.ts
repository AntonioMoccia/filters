import mock from './MOCK_DATA.json'

const query = "(first_name='Jonathan' AND id > 10) OR first_name = 'Edmon' ";

function parseQuery(query: any) {
  const orConditions = query.split('OR').map((group: any) => group.trim());
  return orConditions.map((group: any) => {
    const andConditions = group.split('AND').map((condition: any) => condition.trim());
    return andConditions.map((condition: any) => {
      const [field, operator, value] = condition.match(/(\w+)\s*(=|!=|>|<|>=|<=)\s*('?[^']+'?)/).slice(1);
      return { field, operator, value: value.replace(/'/g, "") };
    });
  });
}


const obj = [
  [
    { field: 'ITMREF_0', op: '=', value: 'M00008198' },
    "AND",
    { field: 'ITMREF_0', op: '=', value: 'M00008199' }
  ],
  "OR",
  { field: 'SEAKEY_0', op: '=', value: 'AI-EL09-0002' }
]



const qr = {
  "OR": [
    {
      "AND": [
        { "field": "name", "operator": "=", "value": "Alice" },
        { "field": "age", "operator": ">", "value": 20 }
      ]
    },
    {
      "AND": [
        { "field": "country", "operator": "=", "value": "Italy" },
        {
          "OR": [
            { "field": "age", "operator": ">=", "value": 30 },
            { "field": "name", "operator": "=", "value": "Bob" }
          ]
        }
      ]
    }
  ]
}
Object.entries(qr).map((enter)=>{
  const [ key, value ] = enter

  console.log(key,value)
})
/**
 * 
  executeOrCondition()

  executeAndCondition()
 */

function applyFilters(data: any, orConditions: any) {
  return data.filter((item: any) => {
    return orConditions.some((andGroup: any) => {
      return andGroup.every((cond: any) => {
        switch (cond.operator) {
          case '=':
            return item[cond.field] == cond.value;
          case '!=':
            return item[cond.field] != cond.value;
          case '>':
            return item[cond.field] > cond.value;
          case '<':
            return item[cond.field] < cond.value;
          case '>=':
            return item[cond.field] >= cond.value;
          case '<=':
            return item[cond.field] <= cond.value;
          default:
            return false;
        }
      });
    });
  });
}

console.log(parseQuery(query));


console.log(applyFilters(mock, parseQuery(query)))

/* const contains ={
  apply(field:keyof typeof mock[0],row:typeof mock[0],value:string){
    const id = field
    const queryResult = row[id].toString().includes(value)
    
    return queryResult
  }
}
const startWith ={
  apply(field:keyof typeof mock[0],row:typeof mock[0],value:string){
    const id = field
    const queryResult = row[id].toString().startsWith(value)
    
    return queryResult
  }
}
const between ={
  apply(field:keyof typeof mock[0],row:typeof mock[0],value:number[]){
    const id = field
    const queryResult = row[id] as number > value[0] && row[id] as number < value[1]
    
    return queryResult
  }
}



  type FilterContains ={
    type:'contains'
    field:keyof typeof mock[0],
    value:string,
    apply:(field:keyof typeof mock[0],row:typeof mock[0],value:string)=>boolean
  }
  type FilterStartWith ={
    type:'startWith'
    field:keyof typeof mock[0],
    value:string,
    apply:(field:keyof typeof mock[0],row:typeof mock[0],value:string)=>boolean
  }
  type FilterBetween ={
    type:'between'
    field:keyof typeof mock[0],
    value:number[],
    apply:(field:keyof typeof mock[0],row:typeof mock[0],value:number[])=>boolean
  }
 type FilterType = FilterContains | FilterStartWith | FilterBetween

const filters : FilterType[] = [
  {
    type:'contains',
    field:'email',
    value:'@',
    apply:contains.apply
  },
  {
    type:'startWith',
    field:'email',
    value:'dca',
    apply:startWith.apply
  },
  {
    type:'between',
    field:'id',
    value:[1,10],
    apply:between.apply
  }
]

const applyFilters = (data:typeof mock, filtersDef : typeof filters)=>{

  const filtered = data.filter(row=>{
      return filters.every(filter=>{
       return filter.apply(filter.field,row,filter.value)
      })
  })
  console.log(filtered)
}


applyFilters(mock,filters)
 */