export default (state = [], action) => {
  switch (action.type) {
    case 'add_songs':
      return action.payload;
    default: 
      return state;
  }
};