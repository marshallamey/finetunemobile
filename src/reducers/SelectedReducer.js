export default (state = [], action) => {
  switch (action.type) {
    case 'select_genre':
      return action.payload;
    default: 
      return state;
  }
};