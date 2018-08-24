export default (state = '', action) => {
  switch (action.type) {
    case 'set_access_token':
      return action.payload;
    default:
      return state;
  }
};
