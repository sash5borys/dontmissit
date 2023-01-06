import React, { useEffect, useRef, useContext } from 'react';
import { StateContext } from '../data/StateProvider';
import { AppContext } from '../App';
import { useImage } from '../utils/useImage';

const ServiceButton = ({ serviceName, isFromAddForm = false }) => {
  const { state, dispatch } = useContext(StateContext);
  const { serviceRefs } = useContext(AppContext);
  const { loading, error, image } = useImage(serviceName);

  return (
    <button
      className={
        'app-srv__list__add-button ' + (state.selectedService == serviceName && 'srv--active')
      }
      style={{
        backgroundImage: `url("${image}")`
      }}
      onClick={(e) => {
        !isFromAddForm
          ? serviceRefs[serviceName].current.scrollIntoView({ behavior: 'smooth', block: 'center' })
          : (e.preventDefault(), dispatch({ type: 'SELECT_SERVICE', serviceName }));
      }}
    ></button>
  );
};

export default ServiceButton;
