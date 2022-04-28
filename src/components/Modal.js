import React, { useEffect, useContext } from 'react';
import { StateContext } from '../data/StateProvider';

const Modal = () => {
  const { state, dispatch } = useContext(StateContext);

  useEffect(() => {
    setTimeout(() => {
      dispatch({ type: 'CLOSE_MODAL' });
    }, 2000);
  }, [state.isModalOpen]);

  return (
    <div className="app-modal">
      <span>{state.modalContent}</span>
    </div>
  );
};

export default Modal;
