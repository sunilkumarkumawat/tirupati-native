export const Strings = {
  APP_BASE_URL:'https://project.tirupatihms.com/hms/Api/',
};

export const getInitials = (name = '') => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};

