export default (state = [], action) => {
  switch (action.type) {
    case 'add_genres':
      return action.payload;
    default: 
      return state;
  }
};