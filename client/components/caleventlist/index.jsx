import React from 'react';

class CalEventList extends React.Component {

    render() {
        let spanStyle = {
            marginRight:'1.25em',
            display:'inline-block'
        };
        const {userevent} = this.props;
        let comp = <span>No events found</span>;
        if (userevent && userevent.events) {
            comp = userevent.events.map(uevent => {
                //console.log('looping thru userevent.events ...');
                //console.dir(uevent);
                let start = new moment(uevent.start).format("MM/DD/YY hh:mm a");
                let end = new moment(uevent.end).format("MM/DD/YY hh:mm a");

                //console.log(m.format());
                if (!uevent.linkedCalendar.calendar_deleted) {
                    let calname = uevent.linkedCalendar.calendar_primary ? "Primary" : uevent.linkedCalendar.calendar_name;
                    return [<li key={uevent.calendar_id}>
                        <a href={`/userevents/${uevent.calendar_id}`}>
                            <span style={spanStyle}>{start}</span>
                            <span style={spanStyle}>{end}</span>
                            <span style={spanStyle}>{calname}</span>
                            <span style={spanStyle}>{uevent.summary}</span>
                            <span style={spanStyle}>{uevent.description}</span>
                        </a>
                        <button onClick={this.deleteEvent.bind(this,uevent)}>Edit</button>
                        <button onClick={this.deleteEvent.bind(this,uevent)}>Delete</button>
                    </li>]
                }

            });
        }

        return (
            <div>
                <ul>
                    {comp}
                </ul>
            </div>
        );
    }
    deleteEvent(uevent){
        console.log('about to delete event:');
        //console.dir(uevent);
        //var event_id = Session.get('event_id');
        //var options = {
        //    calendar_id: uevent.linkedCalendar.calendar_id,
        //    event_id: uevent.event_id
        //}
        let options = {
            from: moment(uevent.start).startOf('isoweek').format(),
            to: moment(uevent.start).endOf('isoweek').format(),
            tzid:"America/Los_Angeles",
            include_deleted: false,
            include_managed: true,
            calendar_id: uevent.linkedCalendar.calendar_id,
            event_id: uevent.event_id
        };
        //console.log("deleteEvent(event_id): " + uevent.event_id);
        console.dir(options);
        const {deleteEvent} = this.props;
        deleteEvent(options);
    }

}

export default CalEventList;

