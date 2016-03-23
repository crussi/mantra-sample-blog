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
                //console.log(uevent.created);

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
                            <span style={spanStyle}>{uevent.description}</span>
                        </a>

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


}

export default CalEventList;

