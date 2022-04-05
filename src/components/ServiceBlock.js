import React, { useState, useContext, useEffect } from 'react';
import { StateContext } from './../StateProvider';
import { defaultSelectors, defaultPeriod, defaultDateFormat } from '../initial';
import moment from 'moment';

const ServiceBlock = ({ serviceName, ws }) => {
  const { state, dispatch } = useContext(StateContext);
  const [url, setUrl] = useState('');

  const sliceDate = (dateText) => {
    const num = dateText.match(/\d+/);
    const token = dateText.match(/[a-z]/);
    return { num, token };
  };
  const { num: periodNum, token: periodToken } = sliceDate(defaultPeriod);

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
        const { err, result: twits } = JSON.parse(e.data);
        if (err) throw new Error(err);
        console.log(`клієнт отримав: [${twits}]`);
        if (twits.length < 1) throw 'немає актуальних даних';

        dispatch({
          type: 'ADD_TWITS',
          serviceName,
          payload: { key, twits }
        });
      } catch (err) {
        const errText = err.toString();
        dispatch({ type: 'HANDLE_ERROR', payload: errText });
      }
    });

    ws.addEventListener('error', (e) => {
      const errText = 'помилка підключення до сервера';
      console.error(errText);
      dispatch({ type: 'HANDLE_ERROR', payload: errText });
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (url) {
      const newPage = {
        id: new Date().getTime().toString(),
        url,
        twits: [
          // {
          //   id: new Date().getTime().toString(),
          //   url: '',
          //   title: '',
          //   desc: '',
          //   img: '',
          // }
        ],
        isFilterOn: true,
        nextUpdateTime: moment().add(periodNum, periodToken).format(defaultDateFormat)
      };

      dispatch({ type: 'ADD_PAGE', serviceName, payload: newPage });
      setUrl('');
      handleTwits(
        state.services[serviceName][state.services[serviceName].length - 1],
        state.services[serviceName].length - 1
      );
    } else {
      const errText = 'будь ласка введіть дані';
      dispatch({ type: 'HANDLE_ERROR', payload: errText });
    }
  };

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
    <section className="app-srv-block__list">
      <h2>#{serviceName}</h2>
      <div className="app-srv-block__list__add-form">
        <form onSubmit={handleSubmit}>
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
          <button type="submit" className="app-srv-block__list__add-form_submit">
            +
          </button>
        </form>
        <details className="app-srv-block__list__dropdown">
          <summary>список джерел</summary>
          <ul>
            {state.services[serviceName] &&
              state.services[serviceName].map((page) => {
                return (
                  <li className="app-srv-block__list__dropdown_item" key={page.id}>
                    <span>{page.url}</span>
                    <span>
                      <button
                        className={
                          'app-srv-block__list__dropdown_item__filter ' +
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
                        onClick={() =>
                          dispatch({
                            type: 'REMOVE_PAGE',
                            serviceName,
                            payload: page.id
                          })
                        }
                      >
                        -
                      </button>
                    </span>
                  </li>
                );
              })}
          </ul>
        </details>
      </div>
      {state.services[serviceName].length > 0 && (
        <div className="app-srv-block__list__dropall">
          <button onClick={() => dispatch({ type: 'REMOVE_ALL_PAGES', serviceName })}>
            очистити все
          </button>
        </div>
      )}
      <div className="app-srv-block__list__twits">
        {state.services[serviceName].length > 0 &&
          state.services[serviceName].map((page) => {
            return (
              <section className="app-srv-block__list__twits__block" key={page.id}>
                {page.twits.length > 0 &&
                  page.isFilterOn &&
                  page.twits.map((twit) => {
                    return (
                      <article className="app-srv-block__list__twits__item" key={twit.id}>
                        <div>
                          <span>
                            <h3>@{page.url}</h3>
                            <a href={twit.url} target="_blank" rel="noreferrer">
                              перейти
                            </a>
                          </span>
                        </div>
                        <hr />
                        <div>
                          <i>[┘]{twit.date}</i>
                          <p className="app-srv-block__list__twits__item__text">{twit.desc}</p>
                          {twit.img && (
                            <div
                              className="app-srv-block__list__twits__item__img"
                              style={{
                                backgroundImage: `url(${twit.img})`
                              }}
                            ></div>
                          )}
                        </div>
                      </article>
                    );
                  })}
              </section>
            );
          })}
      </div>
    </section>
  );
};

export default ServiceBlock;
