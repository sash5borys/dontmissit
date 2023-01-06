import React, { useReducer } from 'react';
import { reducer } from './reducer';
import { state as defaultState } from './state';

export const StateContext = React.createContext();

export const StateProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  return (
    <StateContext.Provider value={{ state, dispatch }}>{props.children}</StateContext.Provider>
  );
};
