import React, { useState } from 'react';
import moment from 'moment';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import { Week } from './Week';

export function Calendar() {
  const [month, setMonth] = useState(moment());
  const [selected, setSelected] = useState(moment().startOf('day'));
  const [duck, setDuck] = useState(0);
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
          <span className="day">Sun</span>
          <span className="day">Mon</span>
          <span className="day">Tue</span>
          <span className="day">Wed</span>
          <span className="day">Thu</span>
          <span className="day">Fri</span>
          <span className="day">Sat</span>
        </div>
      </header>
      {renderWeeks()}
    </section>
  );
}

export default Calendar;
