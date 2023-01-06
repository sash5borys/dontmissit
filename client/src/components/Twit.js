import React from 'react';

const Twit = ({ twit }) => {
  return (
    <article className="app-srv-block__list__twits__item">
      <div className="app-srv-block__list__twits__menu-bar">
        <span>
          <h3>@{twit.page}</h3>
          <span>
            <b>·</b> {twit.date}
          </span>
        </span>
        <a href={twit.url} target="_blank" rel="noreferrer">
          перейти
        </a>
      </div>
      <div className="app-srv-block__list__twits__item__text center-col">
        <p>{twit.desc}</p>
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
};

export default Twit;
