import moment from 'moment';

export const validateDate = value => {
  let errors;
  if (!value) {
    errors = 'Required!';
  } else if (
    moment(value).format(dateFormat) < moment(Date.now()).format(dateFormat)
  ) {
    errors = 'Invalid date!';
  }
  return errors;
};
export const dateFormat = 'MM-DD-YYYY';
export const timeFormat = 'HH:mm';
export const validateEmail = value => {
    if(value){
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,6})+$/.test(value);
    }else{
        return false;
    }
};
export const validateUserLogin = value => {
    let errors;
    if (!value) {
      errors = 'Required!';
    } else if (value && value.length < 9) {
      errors = 'Username must be 9 characters long';
    }
    return errors;
};
export const isRequired = value => (!value ? 'Required!' : '');
export const validateUserName = value => {
    let errors;
    if (!value) {
      errors = 'Required!';
    } else if (value && value.length < 9) {
      errors = 'Username must be 9 characters long';
    }
    return errors;
  };