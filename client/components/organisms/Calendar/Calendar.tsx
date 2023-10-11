import React, { useState } from 'react';
import moment from 'moment';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Week } from './Week';
import Categories from '../../../utils/categories';
import type { Video } from '../../../types/video';

type Props = {
  scheduledVideos: Video[];
  setLocallScheduledVideoData: (videos: Video[]) => void;
};

export function Calendar({ scheduledVideos, setLocallScheduledVideoData }:Props) {
  const [month, setMonth] = useState(moment());
  const [selected, setSelected] = useState(moment().startOf('day'));
  const [duck, setDuck] = useState(0);
  const [editVideoSelected, setEditVideoSelected] = useState<Video>({});

  const previous = () => {
    setDuck(duck - 1);
    setMonth(month.subtract(1, 'month'));
  };

  const next = () => {
    setDuck(duck + 1);
    setMonth(month.add(1, 'month'));
  };

  const select = (day:any) => {
    setSelected(day.date);
    setMonth(day.date.clone());
  };

  const closeEditVideo = () => {
    setEditVideoSelected({});
  };

  const updateEditVideoSelected = (event:React.ChangeEvent<any>, inputName:string) => {
    setEditVideoSelected({
      ...editVideoSelected,
      [`${inputName}`]:
        inputName === 'scheduleDate'
          ? `${event.currentTarget.value}T00:00:00Z`
          : event.currentTarget.value,
    });
  };

  const saveEditVideo = () => {
    axios
      .post('/api/auth/updateVideo', {
        videoId: editVideoSelected.id,
        title: editVideoSelected.title,
        description: editVideoSelected.description,
        scheduleDate: editVideoSelected.scheduleDate,
        categoryId: editVideoSelected.categoryId,
        tags: editVideoSelected.tags,
      })
      .then(() => {
        const updatedScheduledVideos = scheduledVideos.map(video => {
          if (video.id === editVideoSelected.id) {
            return {
              ...video,
              snippet: {
                ...video.snippet,
                title: editVideoSelected.title,
                description: editVideoSelected.description,
                categoryId: editVideoSelected.categoryId,
                tags: editVideoSelected.tags,
              },
              status: {
                publishAt: editVideoSelected.scheduleDate,
              },
            };
          }
          return video;
        });

        setLocallScheduledVideoData(updatedScheduledVideos);
        setEditVideoSelected({});
      });
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

    while (!done) {
      weeks.push(
        <Week
          key={date}
          date={date.clone()}
          month={month}
          select={day => select(day)}
          selected={selected}
          scheduledVideos={scheduledVideos}
          editVideo={({
            id,
            title,
            description,
            scheduleDate,
            categoryId,
            tags,
          }) =>
            setEditVideoSelected({
              id,
              title,
              description,
              scheduleDate,
              categoryId,
              tags,
            })}
        />,
      );
      date.add(1, 'w');
      done = count++ > 2 && monthIndex !== date.month();
      monthIndex = date.month();
    }

    return weeks;
  };

  return (
    <section className="calendar">
      <header className="header">
        <div className="month-display row">
          <CaretLeftOutlined
            className="text-5xl"
            onClick={() => previous()}
          />
          <span className="month-label">{month.format('MMMM YYYY')}</span>
          <CaretRightOutlined
            className="text-5xl"
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
          <h3 className="mb-12">Edit Video</h3>
          <div className="flex mb-2">
            <p className="mr-2 text-slate-400">Title:</p>
            <input
              onChange={event => updateEditVideoSelected(event, 'title')}
              className="border-0 outline-0 bg-transparent grow"
              name="title"
              value={editVideoSelected.title}
              placeholder="Title"
            />
          </div>
          <div className="flex mb-2">
            <p className="mr-2 text-slate-400">Description:</p>
            <textarea
              onChange={event => updateEditVideoSelected(event, 'description')}
              className="border-0 outline-0 bg-transparent grow"
              name="description"
              value={editVideoSelected.description}
              placeholder="Description"
            />
          </div>
          <div className="flex mb-2">
            <p className="mr-2 text-slate-400">Scheduled Date:</p>
            <input
              type="date"
              onChange={event => updateEditVideoSelected(event, 'scheduleDate')}
              className="border-0 outline-0 bg-transparent border-slate-300"
              name="scheduleDate"
              value={editVideoSelected.scheduleDate && editVideoSelected.scheduleDate.split('T')[0]}
              placeholder="Schedule Date"
            />
          </div>
          <div className="flex mb-2">
            <p className="mr-2 text-slate-400">Category:</p>
            <select
              onChange={event => updateEditVideoSelected(event, 'categoryId')}
              className="outline-0 bg-transparent border-slate-300 border"
              name="categoryId"
              defaultValue={editVideoSelected.categoryId}
              placeholder="CategoryId"
            >
              {Categories.map(item => (
                <option key={item.label} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex mb-2">
            <p className="mr-2 text-slate-400">Tags:</p>
            <textarea
              name="tags"
              className="border-0 outline-0 bg-transparent border-slate-300  h-12"
              onChange={event => updateEditVideoSelected(event, 'tags')}
              value={editVideoSelected.tags}
              placeholder="Tags"
            />
          </div>
          <div className="absolute bottom-6 right-0 left-0">
            <button
              className="font-bold py-2 px-4 rounded border border-slate-400 hover:border-slate-500 mr-3"
              onClick={() => saveEditVideo()}
              type="button"
            >
              Update
            </button>
            <button
              className="font-bold py-2 px-4 rounded border border-slate-400 hover:border-slate-500"
              onClick={() => closeEditVideo()}
              type="button"
            >
              Exit
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Calendar;
