function toFindDuplicates(arry) {
  const arryInSetObj = new Set(arry);

  const filteredItems = arry.filter(val=>{
    if(arryInSetObj.has(val)){
      arryInSetObj.delete(val);
    }else return val;
  });

  return [...new Set(filteredItems)];
}

const findUniqueVal = (arr) => {
  const duplicate = toFindDuplicates(arr);

  const uniqueVal = [];
  arr.forEach(val=>{
    if(!duplicate.includes(val)){
      uniqueVal.push(val);
    }
  });

  return uniqueVal;
};


console.log(findUniqueVal([1, 2, 1, 3, 4, 3, 5]));