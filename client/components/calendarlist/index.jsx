import React from 'react';

class CalendarList extends React.Component {
    render() {
        const {usercalendar} = this.props;

            const comp = usercalendar.availCalendars.map(cal => {
                if (!cal.calendar_deleted) {
                    return [<li key={cal.calendar_id}>
                        <a href={`/usercalendars/${cal.calendar_id}`}>{cal.calendar_name}</a>
                        <input
                            type="checkbox"

                            checked={cal.selected}
                            onChange={this.selectCalendar.bind(this,cal.calendar_id)}/>
                        <button onClick={this.createEvent.bind(this,cal.calendar_id)}>Create Event</button>
                        <button onClick={this.deleteEvent.bind(this)}>Delete Event</button>
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

    selectCalendar(id) {
        console.log("selectCalendar id: " + id);
        const {select} = this.props;
        select(id);
    }

    createEvent(calendar_id){
        console.log("createEvent(calendar_id): " + calendar_id);
        //const {createEvent} = this.props;
        //var date = new Date();
        //var start = moment(date).add(1,'h').utc().format("YYYY-MM-DDTHH:mm:ss") + "Z";
        //var end = moment(date).add(2,'h').utc().format("YYYY-MM-DDTHH:mm:ss") + "Z";
        //var event_id = Random.id();
        //Session.set('event_id', event_id);
        //console.log('event_id: ' + event_id);
        //var options = {
        //    calendar_id:calendar_id,
        //    event_id: event_id,
        //    start: start,
        //    end: end,
        //    summary: "hello world",
        //    description: "Meet at Starbucks to say, hello world!",
        //    tzid:"America/Los_Angeles"
        //}

        FlowRouter.go("/cal-event-create/" + calendar_id);
    }
    deleteEvent(event_id){
        var event_id = Session.get('event_id');
        var options = {
            event_id: event_id
        }
        console.log("deleteEvent(event_id): " + event_id);
        const {deleteEvent} = this.props;
        deleteEvent(options);
    }

}

export default CalendarList;

