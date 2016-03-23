export default {
    create({Meteor, LocalState, FlowRouter}, options) {
        if (!options) {
            return LocalState.set('SAVING_ERROR', 'Event criteria is required');
        }

        LocalState.set('SAVING_ERROR', null);

        const id = Meteor.uuid();
        // There is a method stub for this in the config/method_stubs
        // That's how we are doing latency compensation
        Meteor.call('userevent.create', id, criteria, (err) => {
            if (err) {
                return LocalState.set('SAVING_ERROR', err.message);
            }
        });
        Meteor.call('calendars.createEvent', options, (err) => {
            if (err) {
                return LocalState.set('SAVING_ERROR', err.message);
            }
        });
        console.log("userevent create action");
        //FlowRouter.go(`/post/${id}`);
    },

    clearErrors({LocalState}) {
        return LocalState.set('SAVING_ERROR', null);
    }
};