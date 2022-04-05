import React from 'react';

const Twit = ({ page, twit }) => {
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
        <span>(┘){twit.date}</span>
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
};

export default Twit;
