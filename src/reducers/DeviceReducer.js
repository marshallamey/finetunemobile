export default (state = '', action) => {
  switch (action.type) {
    case 'set_device_id':
      return action.payload;
    default:
      return state;
  }
};
