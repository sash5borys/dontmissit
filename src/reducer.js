export const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
        const newAddress = [
          ...state.services[action.serviceName],
          action.payload
        ];

        state.services[action.serviceName] = newAddress;
        return {
          ...state,
          isModalOpen: true,
          modalContent: 'додано новий елемент',
        };
      }
    case 'FILTER_ITEM': {
        const curKey = state.services[action.serviceName].findIndex(
          (address) => address.id === action.payload.id
        );

        const newAddress = {
          ...state.services[action.serviceName][curKey],
          isFilterOn: action.payload.isFilterOn
        };

        state.services[action.serviceName][curKey] = newAddress;
        return { 
          ...state,
          isModalOpen: true,
          modalContent: 'додано новий фільтр' 
        };
      }
    case 'REMOVE_ITEM': {
        const newAddress = state.services[action.serviceName].filter(
          (address) => address.id !== action.payload
        );

        state.services[action.serviceName] = newAddress;
        return { 
          ...state,
          isModalOpen: true,
          modalContent: 'видалено елемент' 
        };
      }
    case 'REMOVE_ALL_ITEM': {
        state.services[action.serviceName] = [];
        return { 
          ...state,
          isModalOpen: true,
          modalContent: 'видалено усі елементи' 
        };
      }
    case 'NO_VALUE': {
        return { 
          ...state,
          isModalOpen: true,
          modalContent: 'будь ласка введіть дані'
        };
      }  
    case 'CLOSE_MODAL': {
        return { 
          ...state,
          isModalOpen: false
        };
      }
    default:
      throw new Error('немає жодної дії');  
  }
};
