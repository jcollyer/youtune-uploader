import React from 'react';
import PropTypes from 'prop-types';

export function Day({ day, select, selected, videoScheduled, editVideo }) {
  const { date, isCurrentMonth, isToday, number } = day;
  if (videoScheduled.length > 0) {
    const video = videoScheduled[0];
    const { snippet, status } = video;
    return (
      <div
        className="video-scheduled-day relative pb-14"
        style={{
          backgroundImage: `url(${snippet.thumbnails.default.url})`,
        }}
      >
        <div className="active-date">{number}</div>
        <p className="mx-3 font-bold truncate">{snippet.title}</p>
        <p className="mx-3 truncate">{snippet.description}</p>
        <button
          onClick={() =>
            editVideo({
              id: video.id,
              title: snippet.title,
              description: snippet.description,
              scheduleDate: status.publishAt,
              categoryId: snippet.categoryId,
              tags: snippet.tags,
            })}
          type="button"
          className="font-bold px-3 border-t border-slate-500 hover:bg-slate-500 bg-slate-600 w-full absolute bottom-0"
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
