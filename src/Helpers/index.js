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

export const userLib = {
  data:{}
};

export function formattedDate(date, forNote) {
  if (!date) return;

  let months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  let newDate = new Date(date);
  const nowDate = new Date();

  const elapsed = nowDate - newDate;

  const msPerMinute = 1000 * 60;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  if (forNote) {
    if (elapsed < msPerHour) {
      if(Math.round(elapsed/msPerMinute) === 0) return 'Baru saja';
      else return `${Math.round(elapsed/msPerMinute)} menit yang lalu`;
    }

    if (elapsed < msPerDay) {
      return `${Math.round(elapsed/msPerHour)} jam yang lalu`;
    }

    if ((elapsed >= msPerDay) && (elapsed < (msPerDay * 2))) {
      return 'Kemarin ' +
        `${newDate.getHours()}:${newDate.getMinutes() < 10 ? '0' + newDate.getMinutes() : newDate.getMinutes()}`;
    }

    return `${newDate.getDate()} ` +
      `${months[newDate.getMonth()].slice(0, 3)} ` +
      `${newDate.getFullYear()} ` +
      `${newDate.getHours()}:${newDate.getMinutes() < 10 ? '0' + newDate.getMinutes() : newDate.getMinutes()}`;
  } else {
    return `${newDate.getDate()} ${
      months[newDate.getMonth()]
    } ${newDate.getFullYear()}`;
  }
}