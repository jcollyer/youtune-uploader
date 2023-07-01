import React from 'react';
import PropTypes from 'prop-types';

export function Day({ day, select, selected, videoScheduled }) {
  const { date, isCurrentMonth, isToday, number } = day;
  const editVideo = id => {
    console.log('editVideo', id);
  };

  if (videoScheduled.length > 0) {
    return (
      <div
        className="video-scheduled-day"
        style={{
          backgroundImage: `url(${videoScheduled[0].snippet.thumbnails.default.url})`,
        }}
      >
        <div className="active-date">{number}</div>
        <p className="mx-3 font-bold truncate">{videoScheduled[0].snippet.title}</p>
        <p className="mx-3 truncate">{videoScheduled[0].snippet.description}</p>
        <button
          onClick={() => editVideo(videoScheduled[0].id)}
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
};

export default Day;
