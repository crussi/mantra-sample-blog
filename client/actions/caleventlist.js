export default {

    readEvents({Meteor, LocalState, FlowRouter},options) {
        LocalState.set('READ_EVENT_ERROR', null);
        //const id = Meteor.uuid();
        // There is a method stub for this in the config/method_stubs
        // That's how we are doing latency compensation
        Meteor.call('calendars.readEvents', options, (err,res) => {
            if (res.status=='error') {
                return LocalState.set('READ_EVENT_ERROR', "Cronofy read events service call failed.");
            } else {
                console.dir(res);
            }

        });
    },
    deleteEvent({Meteor, LocalState, FlowRouter},options) {
        LocalState.set('DELETE_EVENT_ERROR', null);
        //console.log('inside caleventlist action deleteAction options ...');
        console.log("inside action deleteEvent");
        console.dir(options);
        //const id = Meteor.uuid();
        // There is a method stub for this in the config/method_stubs
        // That's how we are doing latency compensation
        //let deleteOptions = {
        //    calendar_id: options.calendar_id,
        //    event_id: options.event_id
        //};
        //delete options.calendar_id;
        let dbOptions = {
            _id: options._id,
            event_id: options.event_id
        }
        delete options._id;
        Meteor.call('calendars.deleteEvent', options, (err) => {
            if (err) {
                return LocalState.set('DELETE_EVENT_ERROR', err.message);
            } else {
                //Event deleted, so refresh user events
                //Meteor.call('calendars.loadWklyEvents', options, (err,status) => {
                //    console.log('status: ' + status);
                //    if (err) {
                //        console.log("error occurred calling calendars.loadWklyEvents");
                //        console.dir(err);
                //    }
                //});
                console.log("back from deleting event");
                Meteor.call('calendars.db.deleteEvent', dbOptions, (err) => {
                    if (err) {
                        return LocalState.set('DELETE_EVENT_ERROR', err.message);
                    } else {
                        console.log("success with db deleteEvent");
                    }
                });
            }
        });
    },
    clearErrors({LocalState}) {
        return LocalState.set('SAVING_ERROR', null);
    }
};
