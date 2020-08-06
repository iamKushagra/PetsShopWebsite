// sort the categories by name A-Z
export function sortByName(a,b){
  const catA = a.name.toUpperCase()
  const catB = b.name.toUpperCase()
  let comparison = 0
  if(catA > catB){
    comparison = 1
  } else if(catA < catB){
    comparison = -1
  }

  return comparison
}