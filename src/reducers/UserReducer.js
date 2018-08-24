export default (state = {}, action) => {
  switch (action.type) {
    case 'set_user':
      return action.payload;
    default:
      return state;
  }
};
