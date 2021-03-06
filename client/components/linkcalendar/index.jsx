import React from 'react';

class LinkCalendar extends React.Component {
    render() {
        return (
            <div className="new-post">
                <h2>Link calendar with Cronofy</h2>
                <button onClick={this.loginWithGoogle.bind(this)}>auth Google</button>
                <button onClick={this.loginWithCronofy.bind(this)}>auth Cronofy</button>
                <button onClick={this.logout.bind(this)}>logout</button>
                <button onClick={this.refreshAccessToken.bind(this)}>Refresh Access Token</button>
                <button onClick={this.revokeAuthorization.bind(this)}>Revoke authorization</button>
                <button onClick={this.listCalendars.bind(this)}>list calendars</button>
                <button onClick={this.calendarRefresh.bind(this)}>Refresh Calendars</button>
                <button onClick={this.loadWklyEvents.bind(this)}>Load Wkly Events</button>
                <button onClick={this.calendarProfile.bind(this)}>Calendar Profile</button>
                <button onClick={this.calendarFreeBusy.bind(this)}>Calendar Free Busy</button>

            </div>
        );
    }

    loginWithGoogle(e) {
        var scopes = ['email',
            'https://www.googleapis.com/auth/plus.me',
            'https://www.googleapis.com/auth/calendar'
        ];
        console.log("loginWithGoogle clicked");
        e.preventDefault();
        return Meteor.loginWithGoogle({
            forceApprovalPrompt: true,
            requestPermissions: scopes,
            requestOfflineToken: true
        }, function (error) {
            if (error) {
                console.log('google login error');
                return console.log(error.reason);
            } else {
                //console.log('google login success');//Meteor.user().services.google.refreshToken;
            }
        });
    }

    loginWithCronofy(e) {
        console.log("loginWithCronofy clicked");
        e.preventDefault();
        return Meteor.loginWithCronofy({
            //access_token: 'i7k9XzMf8oCvQA6DkAgMl-kik6QTawbY',
            //tzid: 'Etc/UTC'
        }, function (error) {
            if (error) {
                console.log('we are expecting login error on loginWithCronofy');
                //console.dir(error);
                //return console.log(error.reason);
            } else {
                //console.log('cronofy login success');
            }
        });
    }

    logout(e) {
        e.preventDefault();
        Meteor.logout(function (err) {
            console.log('user logged out');
        });
    }
    refreshAccessToken() {
        console.log("refresh access token clicked");
        Meteor.call('calendars.refreshAccessToken', (err) => {
            if (err) {
                console.log("error occurred calling calendars.refreshAccessToken");
                console.dir(err);
                //return LocalState.set('SAVING_ERROR', err.message);
            }
        });
    }

    revokeAuthorization() {
        console.log("revoke authorization clicked");
        Meteor.call('calendars.revokeAuthorization', (err,status) => {
            console.log('status: ' + status);
            if (err) {
                console.log("error occurred calling calendars.revokeAuthorization");
                console.dir(err);
                //return LocalState.set('SAVING_ERROR', err.message);
            }
        });
    }

    listCalendars() {
        //console.log("link calendar clicked");
        Meteor.call('calendars.list', (err,status) => {
            console.log('status: ' + status);
            if (err) {
                console.log("error occurred calling calendars.list");
                console.dir(err);
                //return LocalState.set('SAVING_ERROR', err.message);
            }
        });
    }

    calendarProfile() {
        console.log("calendar profile clicked");
        Meteor.call('calendars.profile', (err,status) => {
            console.log('status: ' + status);
            if (err) {
                console.log("error occurred calling calendars.profile");
                console.dir(err);
            }
        });
    }

    calendarFreeBusy() {
        console.log("calendar freeBusy clicked");
        Meteor.call('calendars.freeBusy', (err,status) => {
            console.log('status: ' + status);
            if (err) {
                console.log("error occurred calling calendars.freeBusy");
                console.dir(err);
            }
        });
    }

    //calendarCreateEvent() {
    //    console.log("calendar createEvent clicked");
    //    var date = new Date();
    //    var start = moment(date).add(1,'h').utc().format("YYYY-MM-DDTHH:mm:ss") + "Z";
    //    var end = moment(date).add(2,'h').utc().format("YYYY-MM-DDTHH:mm:ss") + "Z";
    //    var event_id = Random.id();
    //    Session.set('event_id', event_id);
    //    console.log('event_id: ' + event_id);
    //    var options = {
    //        event_id: event_id,
    //        start: start,
    //        end: end,
    //        summary: "hello world",
    //        description: "Meet at Starbucks to say, hello world!",
    //        tzid:"America/Los_Angeles"
    //    }
    //    Meteor.call('calendars.createEvent', options, (err) => {
    //        if (err) {
    //            console.log("error occurred calling calendars.createEvent");
    //            console.dir(err);
    //        }
    //    });
    //}

    calendarDeleteEvent() {
        console.log("calendar deleteEvent clicked");
        var event_id = Session.get('event_id');
        var options = {
            event_id: event_id
        }
        Meteor.call('calendars.deleteEvent', options, (err,status) => {
            console.log('status: ' + status);
            if (err) {
                console.log("error occurred calling calendars.deleteEvent");
                console.dir(err);
            }
        });
    }

    loadWklyEvents() {
        console.log("calendar loadWklyEvents clicked");
        var date = new Date();
        var from = moment().startOf('isoweek').format();
        //moment(date).add(2,'d').utc().format("YYYY-MM-DDTHH:mm:ss") + "Z";
        console.log(moment().endOf('isoweek').format());
        var to = moment().endOf('isoweek').format();
        var options = {
            from: from,
            to: to,
            tzid:"America/Los_Angeles",
            include_deleted: false,
            include_managed: true
        };
        //console.dir(options);
        Meteor.call('calendars.loadWklyEvents', options, (err,status) => {
            console.log('status: ' + status);
            if (err) {
                console.log("error occurred calling calendars.loadWklyEvents");
                console.dir(err);
            }
        });
    }

    calendarRefresh() {
        console.log('calendar refresh');
        Meteor.call('calendars.refresh', (err,status) => {
            console.log('status: ' + status);
            if (err) {
                console.log("error occurred calling calendars.refresh");
                console.dir(err);
            }
        });
    }
}
export default LinkCalendar;
