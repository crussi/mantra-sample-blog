export default {

    readEvents({Meteor, LocalState, FlowRouter},options) {
        LocalState.set('READ_EVENT_ERROR', null);
        //const id = Meteor.uuid();
        // There is a method stub for this in the config/method_stubs
        // That's how we are doing latency compensation
        Meteor.call('calendars.readEventsNew', options, (err,res) => {
            if (res.status=='error') {
                return LocalState.set('READ_EVENT_ERROR', "Cronofy read events service call failed.");
            } else {
                console.dir(res);
            }

        });
    },

    clearErrors({LocalState}) {
        return LocalState.set('SAVING_ERROR', null);
    }
};
