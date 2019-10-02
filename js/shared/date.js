/* Handle dates */
let handleDate = (params) => {
  if (!params.dateString) {return;}
    
  let dateString = new Date(params.dateString),
    dateFormat = (params.dateFormat) ? params.dateFormat : 'yyyy-mm-dd';

  let json = {
      dd: dateString.getDate(),
      yyyy: dateString.getFullYear(),
      mm: dateString.getMonth() + 1,
      HH: ('0' + dateString.getHours()).substr(-2),
      MM: ('0' + dateString.getMinutes()).substr(-2),
      SS: ('0' + dateString.getSeconds()).substr(-2),
      MS: ('0' + dateString.getMilliseconds()).substr(-2)
  };

  for (let i in json) {
      let patt = new RegExp(i, 'gm');
      if (dateFormat.match(patt) !== null) {
          dateFormat = dateFormat.replace(patt, json[i]);
      }
  }
  return dateFormat;
};


export { handleDate }
