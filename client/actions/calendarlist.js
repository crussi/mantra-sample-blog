export default {
    select({Meteor, LocalState, FlowRouter},id) {
        //if (!title || !content) {
        //    return LocalState.set('SAVING_ERROR', 'Title & Content are required!');
        //}

        LocalState.set('SAVING_ERROR', null);

        //const id = Meteor.uuid();
        // There is a method stub for this in the config/method_stubs
        // That's how we are doing latency compensation
        Meteor.call('calendarlist.select', id, (err) => {
            if (err) {
                return LocalState.set('SAVING_ERROR', err.message);
            }
        });

    },

    createEvent({Meteor, LocalState, FlowRouter},options) {
        LocalState.set('CREATE_EVENT_ERROR', null);
        //const id = Meteor.uuid();
        // There is a method stub for this in the config/method_stubs
        // That's how we are doing latency compensation
        Meteor.call('calendars.createEvent', options, (err) => {
            if (err) {
                return LocalState.set('CREATE_EVENT_ERROR', err.message);
            }
        });
    },
    //deleteEvent({Meteor, LocalState, FlowRouter},options) {
    //    LocalState.set('DELETE_EVENT_ERROR', null);
    //    //const id = Meteor.uuid();
    //    // There is a method stub for this in the config/method_stubs
    //    // That's how we are doing latency compensation
    //    Meteor.call('calendars.deleteEvent', options, (err) => {
    //        if (err) {
    //            return LocalState.set('DELETE_EVENT_ERROR', err.message);
    //        }
    //    });
    //},
    clearErrors({LocalState}) {
        return LocalState.set('SAVING_ERROR', null);
    }
};
