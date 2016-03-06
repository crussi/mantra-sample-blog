import React from 'react';

class CalEventList extends React.Component {
    render() {
        const {userevents} = this.props;

        const comp = userevents.events.map(cal => {
            //if (!cal.calendar_deleted) {
                return [<li key={cal.calendar_id}>
                    <a href={`/userevents/${cal.calendar_id}`}>{cal.calendar_id}</a>

                </li>]
            //}
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

export default CalEventList;

