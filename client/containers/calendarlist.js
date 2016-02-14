import CalendarList from '../components/calendarlist/index.jsx';
import {useDeps} from 'react-simple-di';
import {composeWithTracker, composeAll} from 'react-komposer';

export const composer = ({context}, onData) => {
    const {Meteor, Collections} = context();
    if (Meteor.subscribe('usercalendars.list').ready()) {
        const usercalendar = Collections.UserCalendars.findOne({userId: Meteor.userId()});
        onData(null, {usercalendar});
    }
};

export default composeAll(
    composeWithTracker(composer),
    useDeps()
)(CalendarList);
