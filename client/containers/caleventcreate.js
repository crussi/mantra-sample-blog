import CalEventCreate from '../components/caleventcreate/index.jsx';
import {useDeps} from 'react-simple-di';
import {composeWithTracker, composeAll} from 'react-komposer';

export const composer = ({context, clearErrors}, onData) => {
    const {LocalState} = context();
    const error = LocalState.get('SAVING_ERROR');
    onData(null, {error});

    // clearErrors when unmounting the component
    return clearErrors;
};

export const depsMapper = (context, actions) => ({
    create: actions.caleventcreate.create,
    clearErrors: actions.caleventcreate.clearErrors,
    context: () => context
});

export default composeAll(
    composeWithTracker(composer),
    useDeps(depsMapper)
)(CalEventCreate);
