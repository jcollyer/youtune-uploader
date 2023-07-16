import React from 'react';
import PropTypes from 'prop-types';

export function Day({ day, select, selected, videoScheduled, editVideo }) {
  const { date, isCurrentMonth, isToday, number } = day;
  if (videoScheduled.length > 0) {
    const video = videoScheduled[0];
    const snippent = video.snippet;
    return (
      <div
        className="video-scheduled-day"
        style={{
          backgroundImage: `url(${snippent.thumbnails.default.url})`,
        }}
      >
        <div className="active-date">{number}</div>
        <p className="mx-3 font-bold truncate">{snippent.title}</p>
        <p className="mx-3 truncate">{snippent.description}</p>
        <button
          onClick={() => editVideo({ id: video.id, title: snippent.title })}
          type="button"
          className="bg-black bg-opacity-75 p-2 font-bold text-white w-full"
        >
          Edit Video
        </button>
      </div>
    );
  }

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
  videoScheduled: PropTypes.array.isRequired,
  editVideo: PropTypes.func.isRequired,
};

export default Day;
