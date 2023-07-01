import React from 'react';
import PropTypes from 'prop-types';

export function Day({ day, select, selected }) {
  const { date, isCurrentMonth, isToday, number } = day;
  return (
    <button
      key={date.toString()}
      className={`day ${isToday ? ' today' : ''}${
        isCurrentMonth ? '' : ' different-month'
      }${date.isSame(selected) ? ' selected' : ''}`}
      onClick={() => select(day)}
      type="button"
    >
      {number}
    </button>
  );
}

Day.propTypes = {
  day: PropTypes.shape({
    date: PropTypes.object.isRequired,
    isCurrentMonth: PropTypes.bool.isRequired,
    isToday: PropTypes.bool.isRequired,
    number: PropTypes.number.isRequired,
  }).isRequired,
  select: PropTypes.func.isRequired,
  selected: PropTypes.object.isRequired,
};

export default Day;
