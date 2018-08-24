export default (state = '', action) => {
  switch (action.type) {
    case 'set_expire_time':
      return action.payload;
    default:
      return state;
  }
};
