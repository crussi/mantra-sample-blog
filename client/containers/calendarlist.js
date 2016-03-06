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

export const depsMapper = (context, actions) => ({

    select: actions.calendarlist.select,
    createEvent: actions.calendarlist.createEvent,
    deleteEvent: actions.calendarlist.deleteEvent,
    //readEvents: actions.calendarevents.readEvents,
    clearErrors: actions.calendarlist.clearErrors,
    context: () => context
});

export default composeAll(
    composeWithTracker(composer),
    useDeps(depsMapper)
)(CalendarList);
