import React, { useContext } from 'react';
import { StateContext } from './StateProvider';
import Modal from './components/Modal';
import ServiceBlock from './components/ServiceBlock';

const App = () => {
  const { state } = useContext(StateContext);
  const ws = new WebSocket('ws://127.0.0.1:8080');
  const stateServices = Object.keys(state.services);

  return (
    <div className="app">
      <div className="container">
        <header>
          <div className="app-logo">
            <h1 className="app-logo__title">Dont Miss It!</h1>
            <img
              className="app-logo__img"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAADzElEQVRoge2ZT2gcVRzHP+/N7MTMrm1XwUZp01QtllYIrRVFD5JmrRIVBGsPngRRGqH0UChVaCn1KqjowRQ86U2vLd1kkiBBgiBaEQ/ixVJLQrFpus3sZruZeR62qZvNvNk/L9mNsN/L7rzf7/fm+31/f+8NdNBBBx20E6LdBCqRz7JdWXwi4BCAgvFAcmrTQf7QxaybAH+UR7AYQjGEYBewFUUauA7MAr8IwYVuyZgYYOEu+cvAA1VV3RQB/e5LXG2JgMI4O0LFh8A7gFVHiC/gC6XYi+BVjc+3yQxHogxrJkCdReaf5xyCk0Ci0fjCj5DYCfZDkeZcMsPmKIPd6IuioCZJ5QO+Bl5vuo5FuPMbhH3gPEp10ypdnGz2hcuYnyKdD/geA/IAVrr8u/QXlP5caVOCrC7OSMDNSbYkimSB/Sb1ADiPc2/gla7C0rV7phtSckIXV88ki8T8FGmnxDhwoNk6KiESYPcARQgXQS2A7GFUOgy5A/yti2tqDqxly1dCdIHzJDj/Fc3EkYcmVqH5KdKJIh5rTF6DIJDsjdvIYudALstu32O6kGUnrF/Lx8CyAt6Mc9AKyGXZbVlMAM+GFpP+GPucgFHg6bVmGQvBK/HmCNz22CNhAthaUax0/uuM0J2jWxzhTpRxVQ/kJnhCgsdK8tC+xE8upunRGqsLrJAXQB/QDijZgIBkhvPAUWK271YjFBR1tshJvNFEqBIzOpt2FUpmOC8Ux2m/iHxqmn90xth9wH2Rz2l/T4yLs4Q6Y81kbgMMpwtxxrqy0TYOp1sBfBfnUHc63ZbhpPh4U4YbcS4NnQda3BNXXJtPazk1fKBpUU8UCDksBlio5djUiWydeyIUireTh/ipHmej/Mb3eA/4UoWIpWsQzIDy71bsgv0wWNtA1N9MChhOZhipN8A4QfMvcXrxZ86FtzUvSEJXP8jumlU1TB4MD/XqIl3YvKG5yyn7+FD8FZR2Kyq70QR5MBRQ6OJdoN/uA+cxvZ/yIYi8GCybaZI8mPaA4q3l/7VELM1GV4EBeTC/2NpT+WD3gbMr2jH0qV6zjMmDuYBVy6jdGy1CCFYsGUrwgSl5MBWg+D2q2O5dPZxEqupZ8f7ybYcJzARIvtGZqueEVX3Cht7Qwst5PGhGwQDuZr4C/Y5p95XvPGUK7G2RLt79g8yZcDASIA5QUhavESdiB5fve4ozQq6aLyPuIEeFMEtHjK/XUwPMult4DsEwih+AW0AOmBaCY+4czyRf5iNWJoAj7iDDpuRbjvwYxxY8PlNqY31c7KCD/zP+BV6MFqPG2tYzAAAAAElFTkSuQmCC"
            />
          </div>
          {state.isModalOpen && <Modal />}
        </header>
      </div>
      <div className="container full-container">
        <section className={'app-srv-block ' + (stateServices.length < 3 && 'center-container')}>
          {stateServices &&
            stateServices.map((service) => {
              return <ServiceBlock key={service} serviceName={service} ws={ws} />;
            })}
        </section>
      </div>
      <div className="container">
        <footer>
          <span>Слава Україні!</span>
          <span className="app-flag"></span>
        </footer>
      </div>
    </div>
  );
};

export default App;
