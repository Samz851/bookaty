export const formatPhone = (input) => {
    if(typeof(input) !== 'string') input = input.toString();

    if (input.length <= 3){
        input = input.replace(/(\d{1,3})/, "($1");
    } else if ( input.length <= 6){
        input = input.replace(/(\d{3})(\d{1,3})/, "($1) $2");
    } else if ( input.length <= 10){
      input = input.replace(/(\d{3})(\d{3})(\d{1,4})/, "($1) $2-$3");
    } else if ( input.length > 10){
        input = input.replace(/(\d{3})(\d{3})(\d{1,})/, "($1) $2-$3");
    }
    return input;
}

export const formatArrayToString = (input) => {
    if( ! Array.isArray(input)) input = JSON.parse(input);
    if(Array.isArray(input)) input = input.join(', ');
    return input;
}

export const formatStringArrayToString = (arr) => {
    if(typeof(arr) == 'string'){
        if(/\[.+\]/.test(arr)){
            arr = JSON.parse(arr);
        }else{
            arr = arr.split(',');
        }
    }
    return arr;
}

export const formatPermissions = (perm)=>{
    perm = perm.split('_').map(str => str.charAt(0).toUpperCase() + str.slice(1));
    return perm.join(' ');

}

export const capitalizeFirstWord = (input) => {
    if(typeof(input) === 'string') input = input.split(" ");
    if(Array.isArray(input)){
        for (let i = 0; i < input.length; i++) {
            input[i] = input[i][0].toUpperCase() + input[i].substr(1);
        }
        input = input.join(' ');
    }
    return input;
}

export const stripTrailingSlash = str => {
    if (str.substr(-1) === '/') {
      return str.substr(0, str.length - 1);
    }
    return str;
};

export const formateDateTime = datetime => {
    let options = { 
        weekday:"long", 
        year:"numeric", 
        month:"short", 
        day:"numeric", 
        hour: "numeric", 
        minute:"numeric"
    };
    return (new Date(datetime)).toLocaleDateString('en-us', options);
}