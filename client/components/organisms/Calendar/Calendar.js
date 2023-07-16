import React, { useState } from 'react';
import moment from 'moment';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { Week } from './Week';

export function Calendar({ scheduledVideos }) {
  const [month, setMonth] = useState(moment());
  const [selected, setSelected] = useState(moment().startOf('day'));
  const [duck, setDuck] = useState(0);
  const [editVideoSelected, setEditVideoSelected] = useState({});

  const previous = () => {
    setDuck(duck - 1);
    setMonth(month.subtract(1, 'month'));
  };

  const next = () => {
    setDuck(duck + 1);
    setMonth(month.add(1, 'month'));
  };

  const select = day => {
    setSelected(day.date);
    setMonth(day.date.clone());
  };

  const closeEditVideo = () => {
    setEditVideoSelected({});
  };

  const renderWeeks = () => {
    const weeks = [];
    let done = false;
    const date = month
      .clone()
      .startOf('month')
      .add('w' - 1)
      .day('Sunday');
    let count = 0;
    let monthIndex = date.month();

    const editVideo = ({ id, title }) => {
      console.log('editVideo videoId -->', id);
      setEditVideoSelected({ id, title });
    };

    while (!done) {
      weeks.push(
        <Week
          key={date}
          date={date.clone()}
          month={month}
          select={day => select(day)}
          selected={selected}
          scheduledVideos={scheduledVideos}
          editVideo={editVideo}
        />,
      );

      date.add(1, 'w');

      done = count++ > 2 && monthIndex !== date.month();
      monthIndex = date.month();
    }

    return weeks;
  };
  console.log('--------render', !!Object.keys(editVideoSelected).length);
  return (
    <section className="calendar">
      <header className="header">
        <div className="month-display row">
          <CaretLeftOutlined
            style={{ fontSize: '3rem' }}
            onClick={() => previous()}
          />
          <span className="month-label">{month.format('MMMM YYYY')}</span>
          <CaretRightOutlined
            style={{ fontSize: '3rem' }}
            onClick={() => next()}
          />
        </div>
        <div className="row day-names">
          <span className="day day-label">Sun</span>
          <span className="day day-label">Mon</span>
          <span className="day day-label">Tue</span>
          <span className="day day-label">Wed</span>
          <span className="day day-label">Thu</span>
          <span className="day day-label">Fri</span>
          <span className="day day-label">Sat</span>
        </div>
      </header>
      {renderWeeks()}
      {!!Object.keys(editVideoSelected).length && (
        <div className="edit-video">
          <button
            className="edit-video-close-button"
            onClick={() => closeEditVideo()}
            type="button"
          >
            close
          </button>
          <p>{editVideoSelected.title}</p>
        </div>
      )}
    </section>
  );
}

Calendar.propTypes = {
  scheduledVideos: PropTypes.array.isRequired,
};

export default Calendar;
