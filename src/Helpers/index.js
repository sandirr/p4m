export function isEmptyObject(obj) {
  for(let prop in obj) {
    if(Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }
  
  return JSON.stringify(obj) === JSON.stringify({});
}

export const parseMoney = (nom) =>{
  if(nom){
    nom = parseInt(nom.toString().replace(/[^0-9]/g, ''));
    return nom.toString().replace('.','').split('').reverse().join('').match(/\d{1,3}/g).join('.').split('').reverse().join('');
  }
  else
    return null;
};

export const revParseMoney = (nom)=>{
  if(nom){
    return parseInt(nom.toString().split('.').join(''));
  }else return null;
};

export function allFalse(obj)
{
  for(var o in obj)
    if(obj[o]) return false;
        
  return true;
}

export function allTrue(obj)
{
  for(var o in obj)
    if(!obj[o]) return false;
        
  return true;
}