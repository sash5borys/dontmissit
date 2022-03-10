import React, { useState, useContext, useRef } from 'react';
import { StateContext } from './../StateProvider';

const ServiceBlock = ({ serviceName }) => {
  const { state, dispatch } = useContext(StateContext);
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url) {
      const newItem = {
        id: new Date().getTime().toString(),
        url,
        isFilterOn: true
      };
      dispatch({ type: 'ADD_ITEM', serviceName, payload: newItem });
      setUrl('');
    } else {
      dispatch({ type: 'NO_VALUE' });
    }
  };

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
            {state.services[serviceName].map((service) => {
              return (
                <li className="app-srv-block__list__dropdown_item" key={service.id}>
                  <span>{service.url}</span>
                  <span>
                    <button
                      className={
                        'app-srv-block__list__dropdown_item__filter ' +
                        (service.isFilterOn && 'filter--active')
                      }
                      onClick={() =>
                        dispatch({
                          type: 'FILTER_ITEM',
                          serviceName,
                          payload: { id: service.id, isFilterOn: !service.isFilterOn }
                        })
                      }
                    >
                      фiльтр
                    </button>
                    <button
                      onClick={() =>
                        dispatch({ type: 'REMOVE_ITEM', serviceName, payload: service.id })
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
          <button 
            onClick={() =>
              dispatch({ type: 'REMOVE_ALL_ITEM', serviceName })
            }
          >
            очистити все
          </button>
        </div>
      )}
      <div className="app-srv-block__list__twits">
        {state.services[serviceName].map((service) => {
          if (service.isFilterOn) {
            return (
              <article className="app-srv-block__list__twits__item" key={service.id}>
                <div>
                  <span>
                    <h4>@{service.url}</h4>
                    <a href={service.url} target="_blank" rel="noreferrer">
                      перейти
                    </a>
                  </span>
                </div>
                <hr />
                <div>
                  <p className="app-srv-block__list__twits__item__text">lorem ipsum...</p>
                  <div
                    className="app-srv-block__list__twits__item__img"
                    style={{
                      backgroundImage:
                        'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARkAAAC0CAMAAACXO6ihAAAAyVBMVEX7s7PK5P8AAAD/trb/ubm/iIjkoqL3sLC4goLI5v/T7//8srHQ6//MkZHwq6v+sK58WFg1JSWWamqcb2/RlZUgFhawfX1VPDxcQUGUp7yGX1/sqKind3dibnzfn59ONzduTk6OZWV3VFRDLy/Y1+syIyMqHh72ubzpxtE+KyvyvcLky9llR0cXEBAZEBDQ3/fe0uPtwsrb1ejzvMF8jJ2HmKscICSVmaluY2pQTVRIVWBjcH6KdHrT5/86QUq81O0vNDtvfo2qwNcMKSG6AAAM0klEQVR4nO2da4OiOBaGKRIE2wItpdAVBm9ddjujtd1z292enZmd+f8/askFcsKllJtgmfdDdweTSB5zAjk5SWuakpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSUjtCGXV9R32RZVkGlOX5Xd9ST2QYRx3KM5yub6knQsiRwGBlTYkQJOMqMEKKTJEkMqEiIySRGSgyQopMkRSZIikyRVJkiqTIFEmRKVJ5MiWm5EX5Lqkhk+fajoBSZBDGph+6tjtwtNwpFopyaD6fr2MtdAdaKhvCiFThhr6ZU0NSHGkDN/qWBAZCPikT1Xk1lSCDcDibv+r60lvo+ssxcKSmESh4YEwXL/oU0fTsOapy72G5iuk8ujqZ6vrz0QK9gBb3afEN1rD1Qm9oF7As2J3T9NPSvxqby8lgg93tACM8o/86hsltYie0litezSyqBoV7nlqLtmB7Ry95GLv0HxbOKT7F2iK5pROZsaCNuEfrWmguJYMc7sk5kjsz40bwAiashZBBIWgLz4TMNbuwiqrArLoJa+czLD7FK5gcILyEaetKw82FZJB/4nk8aipznlqwEmiwlcigAUju4zxx+0nbkMX+vaRofNj2WSBxXmBDSp+qNXRUtsBlZJCf5LFJHrwW980ycANjTcPOKVMtqMIkJWKXmc0GEkBjq29cYy/Sob4y3LVIe1U6zfhzS2RE/6Y+HCwMf4MzFc0icwAt486Npzi5oyUwT72gzH140UgGrPGwxdH4vEvSx/IjzUj7cdgKGeSlmomn6XYnLY0UBHooegjLAUowA0qayjtNAo6NPfglST/TbxSd6lS6z4w//XP40A4ZkMdPo+LPHkBmrfsIJGmvAP5mZg049s1vaXkkyEwpmYlMCoHBpjSYz8PhQytk4F1lyehOmgyxOJCDkEAz6VPY9NdzZOaUjFuVzGj0Y8SlHTJ4DfNkyLDHKCBDzQXFTWPGsQM1sPzJ48hslQy1pLbIIDicZvvMVhpRdfamF12wSGOf2DswfOHhfSwhQweatsgwS2qLjLQmZWbI7PLJkLnOwGfzJmSn2QIyRntkRtoXzqUVMvB9No+MXkCG5Iv/tsSnezJDipQ8+NsjM4otqS0yLsyTQyY9zswy1SD4WrtimnOtWrMmYUm3QSbqM9TFg2Mxe2uczGj0BXBpmIyzpD8nHCTKWVPyLSD/KTeooHEykiU1TsZnjx04PaxIJvNGlMnRMBnZkpomg8J15pGbQ2ZxARkIN3eNuFkyaUtqnIzHyKAdzJMhszlPRnpDtlsnk7GkpsngFX+JA/PHnDc99/wIrEHn01SeK/uNkxl/TVtSw2Si9xjmcpNeaDJknjNz7RwysIqD5BkOjw3Pm/IsqWEyeBE7I/Ec5KGlwFN4lplr55ARU2sCF3yOp17pp7b5JhicY0nNkiFeOk4G/uJuyj+zj7OLLClzYVUAh80EfG4+s3aWIfNWlGW+JTVKhrqK4jYAXyYjM5HTMpllntMNThAMseZw5L5L9CwXx9skTedl8KWq2F1dZEkNksFoK/26whGR8gMnixygokWuOxJ4SCM0zITwMnZdguK0j8D1A0oGjGy5DzcKRiuwpKbIIGzycUT0+6SX0L6ODulfHxpcgXcfesHnthZNC+z9HGeLM/sCt0W9pVuRzrNWovHXh2IwJclInujIgHE0m0GmndwFGBEwd+c/YfHitgKdDNy57uXfOnaFc1d/Xa1OeoDyigdYokjuAg5T+quZ12lG42JLKk0GhQF0SukzL1gunsCFLWgi0rwn9othk3b1oy2Wbx3o9ovyFHwf8uCa2yRZik0V32hTKb02pamb/pwThDrCH98EU5ZMKrjeSoXby3eAsG9tFrvDcb86Tg1pzd9PVVT0YCVr44vV4bBabGyEi4un07aczpJ525IqWNM5ZVtGefC/imt66ytJ0XQF6eJn0un6R6MfznApPwK/C420M5Z0r2TG35+zpDslMz5vSXdJ5iJLukcyl1nSHZKJLOlCMNXJoMSNfzu62JLqkMHhZr3ehAUzkn7qckuqQSaOEdzeUK8pYUnVyQh/y/ZWek0pS6pMBvoACp0f/VI5S6pMBnr21zfRaUpaUnUywIG2uwEyo1FJS2qEzKH/1jT+qawlVScDHEf5Ttw+qYIlVSYDF+QrxSFfUXFA4nXIkEW3GzGm8U9vLA+0QEYz+UizcvpNJhv80TYZDVnziIvX7wNoKltSHTJsRonzXL+xJ5sFkBWw48FleS5gGnqW8fpmZq+8aPpL6Ley9Dgv+KN9MtR17YTeNHXJHHgbk9ywY8+W28lyZjg5jfKt6XY72U6mnusgnDQRaabjh4Y3m4QovkSu2N5sKQKM2B5De0pCz5G9mUS1DGI2OJxNJpsg1FAdS6pMhtyxaQdrEkG0B3frehM6/pgIGyAc4ihPyZEWRAVfjUHEgDz+d7TRyNqsF/NDvJ2HTjqC5Xqx2sMrtEeE1maxp49FPIiDmOb0O1CyELX3cA1LqkpmYExFDMcTveTbs7VYNNOc3X65BAuMW7BKiOkq2Z78yFE7HTo3JeuYoSf2/HEO7uwkXzFj9uyFQdrjFWA5cOe7x1pgqpCBuyU4GSRvQ3NOAbEDkO8leYbxrEESG2DofI1e2uXHegh25SvOQQeypKVk3UXyBrKf66Gp0mewA35d1meQBiIXTiseigfQHOLCZvILx7V5PNpT4sun8E7qCobLssZB2jB2wPKarn71PqNJ+6ye4kvwbDDeQRAwKD4njzsSmIhGJflnoNkFZCQ0L08+RuBrLd3AGESH/FKr01QkI/p9TAZGAsXuLClwkbcs/pVnCZpodLi4z0hX9tHoJR1J5mJptltvpKlIRthJHhkjHlRgZDDvJUk6SB7miPexi8iYYqD3UtsE2WY4ERbxawdk0NtkktADLEUGI5nVjkdSRVakVSNDRx4x5pEIotGnf4ki/SOTBBBJe8pZ9BW4oB95QEw8LNUkExnx+OvjP/pMJomGkQaaFe38MBCJjDbg/bgumQkefxneChm4oYfG0yF5Q77+4oqHVH0y0TxpeCNk5LC+VFuZlmI+VJPMv3+P5gO3Qkba0EPDybG0oYdolXo9rkzmN0Lidslo6TdVcTxBXTLf3TgZcbBIoqDEm967JBPH/yPpfBgi7c7JJBsisSuFFes8AvquyMBnE1tm4H9Ingx9fn9k4PvMlk1r2CfYh36qV7MyGXRTZJINRdmTMrDYxmGDNWBqaJd4IdJkRp/+01cyLzlkEmc23InDehIW7gcEtlEwMsD2jMvIjL/+/q1XZPDbZHLn2vGW22fgEk7AMfsDG0zYzpsc+5LIjH8YPr5Bpg6Y2jFXudaUHNQG/TOs8VjaAhefxxKHDQg3L/FKRQM1eIbl+Wc+Dh8Amcw7cLdk+L7GfJ9e9icnmwRt4QPeSCjhduaV7Tj20174vLP29V8yT3r8I0l/I2QefxYZ/uyADHjD97NkYj8w2IMbb+6i2yeT9Sc+Qp+SfUt6SmBmzl6U4ZYuaj2PIv0/ssD0+Je48PfVV+KkvXm8zRIZtlsSi0vJLkEsJVnfOyWertTqjL4G5nhyiS9H2vz2MHwY/g3ShMTjryL9V50huBIXyVV3YtupJTLksE6ws3ApIib4Nr+tQ5a0WY452I+NpVrWWOpEexuJsx2JfnscPvwB0t9kY4pQ1UBTCcyLLokdIgRH4Lk+dV0+hqxm0nmr2PeoKa4t1yXDytqWlr2xk1B/inoWJ3PYbiw3NJF8gEtkPw9yWh9+k9O/XDkWAsvK9BkNI9sLZrPAM8KcIAaMTdcKpptpYIXZCH2ybh3MAsune+HcwHBNETXBQyg+fmB6fHj8AJVOf+gkFiLdXnl2cGYf4Jsfw09y8oy/rxP80TmZ9lQxIPHdkykdJH8vZK5kSbdHpmYY1bslcz1LujEy1UN73zmZa1pSa2QGjdWa6LqWdENkrmxJzZJJnz3epK5tSY2SgV4no1ky5CT5a3NpkgwISG1222kHltQkGcmjBPyZ9dWFJTVIBq/1ZyBxIFVddWNJDZLRzJQaqjb3rNHbItOOxp+r7A19/2Rqbdx6z2Q6tKR+kzl/rtt9knnrrNG7JtOxJfWXTPGpvfdNpntL6imZHlgSUdcYsur6mRSraw5pnTu193rqmkRKPbEkoq5RyOqLJRF1zQLqklN7r6euaQD1yJKIusYh1CdLIuqaR6z+PJNidU2Eq/B/N+lOXSNhKn9CYvvqmgnR6MLzr6+rrqloF/yfDN2oayz9tCSirrn005KIugZz9eCPi9UtmL5aElG3YK4U2ltJHXLpsSURdQemo+CPi9UdmD5bElFHXHpuSUTdgOm7JRF1A6ajMKpS6oDLDVgSUQdgrrfdpJb+DzoWBGeGYETBAAAAAElFTkSuQmCC)'
                    }}
                  ></div>
                </div>
              </article>
            );
          }
        })}
      </div>
    </section>
  );
};

export default ServiceBlock;
