import React, { useState, useContext, useEffect, useRef } from 'react';
import { StateContext } from '../data/StateProvider';
import { AppContext } from '../App';
import { defaultSelectors, defaultPeriod, defaultDateFormat } from '../initial';
import Twit from './Twit';
import moment from 'moment';

const ServiceBlock = ({ serviceName }) => {
  const serviceListSection = useRef(null);
  const { state, dispatch } = useContext(StateContext);
  const { ws, serviceRefs } = useContext(AppContext);
  const [url, setUrl] = useState('');
  const sliceDate = (dateText) => {
    const num = dateText.match(/\d+/);
    const token = dateText.match(/[a-z]/);
    return { num, token };
  };
  const { num: periodNum, token: periodToken } = sliceDate(defaultPeriod);

  const toggleHidden = (el) => {
    el.style.display = el.style.display == 'none' ? 'block' : 'none';
  };

  const canIUpdatePage = (pageTime, globalTime) => {
    const timeDiff = moment(globalTime, defaultDateFormat).diff(
      moment(pageTime, defaultDateFormat),
      's'
    );
    return timeDiff >= 0;
  };

  const handleTwits = (page, key) => {
    ws.send(
      JSON.stringify({
        type: 'FETCH_DATA',
        payload: {
          serviceName: serviceName,
          page,
          selectors: defaultSelectors[serviceName],
          period: defaultPeriod
        }
      })
    );

    ws.addEventListener('message', (e) => {
      try {
        const { err, data: twits } = JSON.parse(e.data);
        console.log(`клієнт отримав: ${e.data}`);
        if (err) throw err;
        if (twits.length < 1) throw 'немає актуальних даних';

        dispatch({
          type: 'ADD_TWITS',
          serviceName,
          payload: { key, twits }
        });
      } catch (err) {
        const errText = err + '';
        console.error(errText);
        dispatch({ type: 'HANDLE_MODAL_CONTENT', payload: errText });
      }
    });
    ws.addEventListener('close', () => {
      console.log(`клієнт ${ip} відключено`);
    });
  };

  const mergingTwits = (service) => {
    let twits = service.flatMap((page) => {
      if (page.isFilterOn) {
        return page.twits;
      }
      return;
    });
    return twits.sort(function (a, b) {
      return (
        moment(a.date, defaultDateFormat).format('x') -
        moment(b.date, defaultDateFormat).format('x')
      );
    });
  };

  const stateTwits = mergingTwits(state.services[serviceName]);

  // useEffect(() => {
  //   handleTwits(
  //     state.services[serviceName][state.services[serviceName].length - 1],
  //     state.services[serviceName].length - 1
  //   );
  // }, [state.services[serviceName]]);

  useEffect(() => {
    console.log(`період оновлення ${defaultPeriod}`);
    dispatch({
      type: 'HANDLE_GLOBAL_TIMER',
      payload: { nextUpdateTime: moment().add(periodNum, periodToken).format(defaultDateFormat) }
    });

    setInterval(() => {
      if (state.services[serviceName].length > 0) {
        state.services[serviceName].map((page, key) => {
          if (
            page.isFilterOn &&
            canIUpdatePage(page.nextUpdateTime, moment().format(defaultDateFormat))
          ) {
            console.log(`оновлення для ${page.url}`);
            handleTwits(page, key);

            dispatch({
              type: 'HANDLE_PAGE_TIMER',
              serviceName,
              payload: {
                key,
                nextUpdateTime: moment().add(periodNum, periodToken).format(defaultDateFormat)
              }
            });
          }
        });
      }
      dispatch({
        type: 'HANDLE_GLOBAL_TIMER',
        payload: { nextUpdateTime: moment().add(periodNum, periodToken).format(defaultDateFormat) }
      });
    }, periodNum.toString() * 60 * 1000);
  }, []);

  return (
    <section className="app-srv-block__list center-col" ref={serviceRefs[serviceName]}>
      <section className="app-srv-block__list__menu-bar center-row">
        <h2>{serviceName}</h2>
        <ul className="app-nav__list">
          <li className="app-nav__list__item">
            <button
              className="app-nav__list__add-button"
              onClick={() => toggleHidden(serviceListSection.current)}
            >
              ⧩
            </button>
          </li>
          <li className="app-nav__list__item">
            <button
              className="app-nav__list__add-button"
              onClick={() => dispatch({ type: 'REMOVE_ALL_PAGES', serviceName })}
            >
              🗑
            </button>
          </li>
          <li className="app-nav__list__item">
            <button className="app-nav__list__add-button">x</button>
          </li>
        </ul>
        <ul className="app-srv-block__list__dropdown" ref={serviceListSection}>
          {state.services[serviceName] &&
            state.services[serviceName].map((page) => {
              return (
                <li className="app-srv-block__list__dropdown_item" key={page.url}>
                  <span>{page.url}</span>
                  <span>
                    <button
                      className={
                        'app-srv-block__list__dropdown_item__add-button ' +
                        (page.isFilterOn && 'filter--active')
                      }
                      onClick={() =>
                        dispatch({
                          type: 'FILTER_PAGE',
                          serviceName,
                          payload: { id: page.id, isFilterOn: !page.isFilterOn }
                        })
                      }
                    >
                      фiльтр
                    </button>
                    <button
                      className="app-srv-block__list__dropdown_item__add-button"
                      onClick={() =>
                        dispatch({
                          type: 'REMOVE_PAGE',
                          serviceName,
                          payload: page.id
                        })
                      }
                    >
                      видалити
                    </button>
                  </span>
                </li>
              );
            })}
        </ul>
      </section>
      <section className="app-srv-block__list__twits">
        {stateTwits.length > 0 &&
          stateTwits.map((twit) => {
            return <Twit key={twit.id} twit={twit} />;
          })}
        {/* <article className="app-srv-block__list__twits__item">
          <div className="app-srv-block__list__twits__menu-bar">
            <span>
              <h3>@Tsn</h3>
              <span>
                <b>·</b> 28.08.2022
              </span>
            </span>
            <a href="tsn.ua/123" target="_blank" rel="noreferrer">
              перейти
            </a>
          </div>
          <div className="app-srv-block__list__twits__item__text center-col">
            <p>GJgfdjkhgkjsdhgjkdhjgsdh gfdsjkhgkf fdhsajf fdshjkfhask...</p>
            <div
              className="app-srv-block__list__twits__item__img"
              style={{
                backgroundImage: `url(https://pbs.twimg.com/media/FbRIqS8XwAUbAYt?format=jpg&name=small)`
              }}
            ></div>
          </div>
        </article> */}
      </section>
    </section>
  );
};

export default ServiceBlock;
