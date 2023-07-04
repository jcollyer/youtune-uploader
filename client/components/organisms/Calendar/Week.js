import React from 'react';
import PropTypes from 'prop-types';
import { Day } from './Day';

export function Week({ date, month, select, selected, scheduledVideos }) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const day = {
      name: date.format('dd').substring(0, 1),
      number: date.date(),
      isCurrentMonth: date.month() === month.month(),
      isToday: date.isSame(new Date(), 'day'),
      date,
    };
    const videoScheduled = scheduledVideos.filter(
    /* eslint-disable */ 
      video =>
        video.status.publishAt.split('T')[0] === date.format('YYYY-MM-DD'),
    );

    days.push(
      <Day
        day={day}
        selected={selected}
        select={select}
        key={i}
        videoScheduled={videoScheduled}
      />,
    );

    /* eslint-disable */
    date = date.clone();
    date.add(1, 'day');
  }

  return (
    <div className="row week" key={days[0]}>
      {days}
    </div>
  );
}

Week.propTypes = {
  date: PropTypes.object.isRequired,
  month: PropTypes.object.isRequired,
  select: PropTypes.func.isRequired,
  selected: PropTypes.object.isRequired,
  scheduledVideos: PropTypes.array.isRequired,
};

export default Week;