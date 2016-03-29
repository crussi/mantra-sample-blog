import CalEventList from '../components/caleventlist/index.jsx';
import {useDeps} from 'react-simple-di';
import {composeWithTracker, composeAll} from 'react-komposer';

export const composer = ({context}, onData) => {
    const {Meteor, Collections} = context();
    if (Meteor.subscribe('cal-event-list').ready()) {
        console.log("inside cal-event-list subscription");
        const userevent = Collections.UserEvents.findOne({});
        console.log("inside cal-event-list after findOne");
        console.dir(userevent);
        onData(null, {userevent});
    } else {
        console.log("subscribe cal-event-list not ready");
    }
};

export const depsMapper = (context, actions) => ({
    deleteEvent: actions.caleventlist.deleteEvent,
    context: () => context
});

export default composeAll(
    composeWithTracker(composer),
    useDeps(depsMapper)
)(CalEventList);
