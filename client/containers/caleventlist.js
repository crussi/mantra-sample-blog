import CalEventList from '../components/caleventlist/index.jsx';
import {useDeps} from 'react-simple-di';
import {composeWithTracker, composeAll} from 'react-komposer';

export const composer = ({context}, onData) => {
    const {Meteor, Collections} = context();
    if (Meteor.subscribe('cal-event-list').ready()) {
        const userevents = Collections.UserEvents.findOne({});
        onData(null, {userevents});
    }
};

export const depsMapper = (context, actions) => ({

    context: () => context
});

export default composeAll(
    composeWithTracker(composer),
    useDeps(depsMapper)
)(CalEventList);
