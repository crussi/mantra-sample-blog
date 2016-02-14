import React from 'react';

class CalendarList extends React.Component {
    render() {
        const {usercalendar} = this.props;
        const comp = usercalendar.availCalendars.map(cal => {
            if (!cal.calendar_deleted){
                return [<li key={cal.calendar_id}>
                    <a href={`/usercalendars/${cal.calendar_id}`}>{cal.calendar_name}</a>
                </li>]
            }
        });
        return (
            <div>
                <ul>
                    {comp}
                </ul>
            </div>
        );
    }
}

export default CalendarList;

