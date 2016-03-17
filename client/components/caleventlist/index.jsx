import React from 'react';

class CalEventList extends React.Component {
    render() {
        const {userevent} = this.props;
        console.dir(userevent);
        let comp;
        if (userevent && userevent.events){
            comp = userevent.events.map(uevent => {
                //if (!cal.calendar_deleted) {
                return [<li key={uevent.event_id}>
                    <a href={`/userevents/${uevent.event_id}`}>{uevent.description}</a>

                </li>]
                //}
            });
        } else {
            comp = <li>Not found</li>
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

