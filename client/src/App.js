import React, { useContext, useRef, useState } from 'react';
import { defaultPeriod, defaultDateFormat } from './initial';
import { StateContext } from './data/StateProvider';
import Modal from './components/Modal';
import ServiceBlock from './components/ServiceBlock';
import ServiceButton from './components/ServiceButton';
import comeBackAliveImg from './assets/come_back_alive.png';
import moment from 'moment';
import { sliceDate } from "./utils/date";

export const AppContext = React.createContext();
const ws = new WebSocket('ws://localhost:8080/api/ws');

const App = () => {
  const { state, dispatch } = useContext(StateContext);
  const [url, setUrl] = useState('');
  const stateServices = Object.keys(state.services);
  const isServicesAvailable = Object.values(state.services).flat().length > 0;
  const addNewServiceSection = useRef(null);
  const serviceRefs = stateServices.reduce((acc, val) => ({ ...acc, [val]: useRef() }), {});
  const { num: periodNum, token: periodToken } = sliceDate(defaultPeriod);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (state.selectedService && url) {
      const newPage = {
        id: new Date().getTime().toString(),
        url,
        twits: [],
        isFilterOn: true,
        nextUpdateTime: moment().add(periodNum, periodToken).format(defaultDateFormat)
      };

      dispatch({ type: 'ADD_PAGE', serviceName: state.selectedService, payload: newPage });
      setUrl('');
    } else {
      const errText = 'будь ласка введіть дані';
      dispatch({ type: 'HANDLE_MODAL_CONTENT', payload: errText });
    }
  };

  return (
    <AppContext.Provider value={{ ws, serviceRefs }}>
      <div className="app center-col">
        <header className="container header-container">
          <a className="app-logo">
            <h1 className="app-logo__title">D!</h1>
            <img
              className="app-logo__img"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAADzElEQVRoge2ZT2gcVRzHP+/N7MTMrm1XwUZp01QtllYIrRVFD5JmrRIVBGsPngRRGqH0UChVaCn1KqjowRQ86U2vLd1kkiBBgiBaEQ/ixVJLQrFpus3sZruZeR62qZvNvNk/L9mNsN/L7rzf7/fm+31/f+8NdNBBBx20E6LdBCqRz7JdWXwi4BCAgvFAcmrTQf7QxaybAH+UR7AYQjGEYBewFUUauA7MAr8IwYVuyZgYYOEu+cvAA1VV3RQB/e5LXG2JgMI4O0LFh8A7gFVHiC/gC6XYi+BVjc+3yQxHogxrJkCdReaf5xyCk0Ci0fjCj5DYCfZDkeZcMsPmKIPd6IuioCZJ5QO+Bl5vuo5FuPMbhH3gPEp10ypdnGz2hcuYnyKdD/geA/IAVrr8u/QXlP5caVOCrC7OSMDNSbYkimSB/Sb1ADiPc2/gla7C0rV7phtSckIXV88ki8T8FGmnxDhwoNk6KiESYPcARQgXQS2A7GFUOgy5A/yti2tqDqxly1dCdIHzJDj/Fc3EkYcmVqH5KdKJIh5rTF6DIJDsjdvIYudALstu32O6kGUnrF/Lx8CyAt6Mc9AKyGXZbVlMAM+GFpP+GPucgFHg6bVmGQvBK/HmCNz22CNhAthaUax0/uuM0J2jWxzhTpRxVQ/kJnhCgsdK8tC+xE8upunRGqsLrJAXQB/QDijZgIBkhvPAUWK271YjFBR1tshJvNFEqBIzOpt2FUpmOC8Ux2m/iHxqmn90xth9wH2Rz2l/T4yLs4Q6Y81kbgMMpwtxxrqy0TYOp1sBfBfnUHc63ZbhpPh4U4YbcS4NnQda3BNXXJtPazk1fKBpUU8UCDksBlio5djUiWydeyIUireTh/ipHmej/Mb3eA/4UoWIpWsQzIDy71bsgv0wWNtA1N9MChhOZhipN8A4QfMvcXrxZ86FtzUvSEJXP8jumlU1TB4MD/XqIl3YvKG5yyn7+FD8FZR2Kyq70QR5MBRQ6OJdoN/uA+cxvZ/yIYi8GCybaZI8mPaA4q3l/7VELM1GV4EBeTC/2NpT+WD3gbMr2jH0qV6zjMmDuYBVy6jdGy1CCFYsGUrwgSl5MBWg+D2q2O5dPZxEqupZ8f7ybYcJzARIvtGZqueEVX3Cht7Qwst5PGhGwQDuZr4C/Y5p95XvPGUK7G2RLt79g8yZcDASIA5QUhavESdiB5fve4ozQq6aLyPuIEeFMEtHjK/XUwPMult4DsEwih+AW0AOmBaCY+4czyRf5iNWJoAj7iDDpuRbjvwYxxY8PlNqY31c7KCD/zP+BV6MFqPG2tYzAAAAAElFTkSuQmCC"
            />
          </a>
          <ul className="app-srv__list center-col">
            {true &&
              stateServices.map((service) => {
                return (
                  <li className="app-srv__list__item" key={service}>
                    <ServiceButton serviceName={service} />
                  </li>
                );
              })}
            <li className="app-srv__list__item">
              <button
                className="app-srv__list__add-button"
                onClick={() =>
                  addNewServiceSection.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                  })
                }
              >
                +
              </button>
            </li>
          </ul>
        </header>
        <div className="container full-container">
          {state.isModalOpen && <Modal />}
          <section className={'app-srv-block ' + (!isServicesAvailable && 'full-block')}>
            {isServicesAvailable &&
              stateServices.map((service) => {
                return <ServiceBlock key={service} serviceName={service} />;
              })}

            <section className="app-srv-block__list center-col" ref={addNewServiceSection}>
              <form className="app-srv-block__list__add-form" onSubmit={handleSubmit}>
                <h2>
                  Додай сторінку <br /> для відслідковування
                </h2>
                {state.selectedService && (
                  <div className="app-srv-block__list__add-form_add-button">
                    <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
                    <button type="submit">+</button>
                  </div>
                )}
                <ul className="app-srv__list center-row">
                  {true &&
                    stateServices.map((service) => (
                      <li className="app-srv__list__item" key={service}>
                        <ServiceButton serviceName={service} isFromAddForm={true} />
                      </li>
                    ))}
                </ul>
              </form>
              <div className="app-srv-block__list__add-donate">
                <h3>Підтримуємо Збройні Сили України!</h3>
                <div className="app-srv__list center-row">
                  <a
                    href="https://savelife.in.ua"
                    title="Домашня сторінка фонду Повернись живим"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={comeBackAliveImg} alt="Домашня сторінка фонду Повернись живим" />
                  </a>
                </div>
              </div>
            </section>
          </section>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default App;
