export const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_PAGE': {
      const newPage = [...state.services[action.serviceName], action.payload];

      state.services[action.serviceName] = newPage;
      return {
        ...state,
        isModalOpen: true,
        modalContent: 'додано новий елемент'
      };
    }
    case 'FILTER_PAGE': {
      const curKey = state.services[action.serviceName].findIndex(
        (address) => address.id === action.payload.id
      );

      const newPage = {
        ...state.services[action.serviceName][curKey],
        isFilterOn: action.payload.isFilterOn
      };

      state.services[action.serviceName][curKey] = newPage;
      return {
        ...state,
        isModalOpen: true,
        modalContent: 'додано новий фільтр'
      };
    }
    case 'REMOVE_PAGE': {
      const newPage = state.services[action.serviceName].filter(
        (address) => address.id !== action.payload
      );

      state.services[action.serviceName] = newPage;
      return {
        ...state,
        isModalOpen: true,
        modalContent: 'видалено елемент'
      };
    }
    case 'REMOVE_ALL_PAGES': {
      state.services[action.serviceName] = [];
      return {
        ...state,
        isModalOpen: true,
        modalContent: 'видалено усі елементи'
      };
    }
    case 'HANDLE_ERROR': {
      return {
        ...state,
        isModalOpen: true,
        modalContent: action.payload
      };
    }
    case 'CLOSE_MODAL': {
      return {
        ...state,
        isModalOpen: false
      };
    }
    case 'HANDLE_GLOBAL_TIMER': {
      return {
        ...state,
        nextUpdateTime: action.payload.nextUpdateTime
      };
    }
    case 'HANDLE_PAGE_TIMER': {
      const newPage = {
        ...state.services[action.serviceName][action.payload.key],
        nextUpdateTime: action.payload.nextUpdateTime
      };

      state.services[action.serviceName][action.payload.key] = newPage;
      return {
        ...state
      };
    }
    case 'ADD_TWITS': {
      const newPage = {
        ...state.services[action.serviceName][action.payload.key],
        twits: [
          ...state.services[action.serviceName][action.payload.key].twits,
          ...action.payload.twits
        ]
      };

      state.services[action.serviceName][action.payload.key] = newPage;
      return {
        ...state,
        isModalOpen: true,
        modalContent: 'оновлення даних'
      };
    }
    default:
      throw new Error('немає жодної дії');
  }
};
