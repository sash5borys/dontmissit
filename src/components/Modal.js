import React, { useEffect, useContext } from 'react';
import { StateContext } from './../StateProvider';

const Modal = () => {
  const { state, dispatch } = useContext(StateContext);

  useEffect(() => {
    setTimeout(() => {
      dispatch({ type: 'CLOSE_MODAL' });
    }, 2000);
  }, [state.isModalOpen]);

  return (
    <div className="app-modal">
      <p>{state.modalContent}</p>
    </div>
  );
};

export default Modal;
