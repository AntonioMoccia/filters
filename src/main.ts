import mock from './MOCK_DATA.json'


const contains ={
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
