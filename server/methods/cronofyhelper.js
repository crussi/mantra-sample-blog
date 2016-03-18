import cronofy from 'cronofy';
import {UserCalendars} from '/libs/collections';
import {UserEvents} from '/libs/collections';

const cronofyHelper = function(userId) {
    //store userId for use throughout functions
    var self = this;
    this.userId = userId;
    this.user = Meteor.users.findOne({_id: this.userId});
    return {
        hasLinkedCalendar: function () {
            //Did the user authenticate with Cronofy?
            return self.user && self.user.services.cronofy ? true : false;
        },
        attachUserId: function (errMsg) {
            check(errMsg, String);
            //Attach userId to any logged errors
            let currentUserId = self.userId || "no user id";
            let e = errMsg + " for userId: " + currentUserId;
            return e;
        },
        isExpired: function () {
            //Has the Cronofy authentication token expired?
            if (this.hasLinkedCalendar()) {
                return moment().toDate() > self.user.services.cronofy.expiresAt;
            } else {
                return true;
            }
        },
        config: function () {
            //Retrieve service configuration info
            var config = ServiceConfiguration.configurations.findOne({service: 'cronofy'});
            if (!config) {
                Winston.log('error', this.attachUserId("Service configuration error.  Service 'cronofy'"));
                throw new ServiceConfiguration.ConfigError();
            }
            return config;
        },
        checkLinkedCalendar: function (callback) {
            //Validate existence of linked calendar, refresh access token if necessary
            check(callback, Function);
            if (!this.hasLinkedCalendar()) {
                Winston.log('error', this.attachUserId("Cronofy - checkLinkedCalendar - no linked calendar found"));
                callback('error');
                return false;
            } else {
                if (this.isExpired()) {
                    this.refreshAccessToken(callback);
                } else {
                    callback('success');
                }
            }

        },
        refreshAccessToken: function (callback) {
            //Don't call checkLinkedCalendar here!  Infinite loop.
            //Refresh access token and update Meteor user account information
            check(callback, Function);
            if (!this.hasLinkedCalendar()) {
                Winston.log('error', this.attachUserId("Cronofy - refreshAccessToken - no linked calendar found"));
                callback('error');
            } else {
                var config = this.config();
                var options = {
                    client_id: config.client_id,
                    client_secret: config.client_secret,
                    grant_type: 'refresh_token',
                    refresh_token: self.user.services.cronofy.refreshToken
                };
                cronofy.refreshAccessToken(options, Meteor.bindEnvironment((err, res) => {
                    if (!err) {
                        //why are you getting logged in user when all you need is the userId?
                        Meteor.users.update({_id: self.userId}, {$set: {"services.cronofy.accessToken": res.access_token}});
                        Meteor.users.update({_id: self.userId}, {$set: {"services.cronofy.refreshToken": res.refresh_token}});
                        Meteor.users.update({_id: self.userId}, {$set: {"services.cronofy.expiresAt": moment().add(res.expires_in, 's').toDate()}});
                        callback('success', res);
                    } else {
                        Winston.log('error', this.attachUserId("Cronofy - refreshAccessToken - unable to refresh access token"));
                        callback('error');
                    }
                }));
            }
        },
        revokeAuthorization: function (callback) {
            //Revoke this user's access token, user must reauthenticate with Cronofy to continue
            check(callback, Function);
            this.checkLinkedCalendar( (status, res) => {
                if (status == 'success') {
                    var config = this.config();
                    var options = {
                        client_id: config.client_id,
                        client_secret: config.client_secret,
                        token: self.user.services.cronofy.accessToken
                    };
                    cronofy.revokeAuthorization(options, Meteor.bindEnvironment((err, res) => {
                        if (!err) {
                            callback('success', res);
                        } else {
                            Winston.log('error', self.attachUserId("Cronofy - revokeAuthorization - unable to revoke authorization"));
                            callback('error');
                        }
                    }));
                } else {
                    callback(status, res);
                }
            });
        },
        calendarList: function (callback) {
            //Produce a list of available calendars
            check(callback, Function);
            that = this;
            //this.callback = callback;
            this.checkLinkedCalendar((status, res) => {
                if (status == 'success') {
                    var options = {
                        access_token: self.user.services.cronofy.accessToken
                    };
                    cronofy.listCalendars(options, Meteor.bindEnvironment((err, res) => {
                        if (!err) {
                            Winston.log('info', 'success in calendarList');
                            callback('success', res);
                        } else {
                            Winston.log('error', this.attachUserId("Cronofy - calendarList - unable to fetch calendar list"));
                            callback('error');
                        }
                    }));
                } else {
                    callback(status, res);
                }
            });
        },
        userProfile: function (callback) {
            //Output the user's Cronofy profile
            check(callback, Function);
            this.checkLinkedCalendar((status, res) => {
                if (status == 'success') {
                    var options = {
                        access_token: self.user.services.cronofy.accessToken
                    };
                    cronofy.profileInformation(options, Meteor.bindEnvironment((err, res) => {
                        if (!err) {
                            callback('success', res);
                        } else {
                            Winston.log('error', this.attachUserId("Cronofy - userProfile - unable to fetch profile information"));
                            callback('error');
                        }
                    }));
                } else {
                    callback(status, res);
                }
            });
        },
        freeBusy: function (options, callback) {
            //Output "free | busy" status for calenar options provided
            check(options, {from: String, to: String, tzid: String});
            check(callback, Function);
            this.checkLinkedCalendar((status, res) => {
                if (status == 'success') {
                    options = _.extend(options, {
                        access_token: self.user.services.cronofy.accessToken
                    });
                    cronofy.freeBusy(options, Meteor.bindEnvironment((err, res) => {
                        if (!err) {
                            callback('success', res);
                        } else {
                            Winston.log('error', this.attachUserId("Cronofy - freeBusy - unable to fetch free-busy information."), options);
                            callback('error');
                        }
                    }));
                } else {
                    callback(status, res);
                }
            });
        },
        createEvent: function (options, callback) {
            //Create a calendar event for the options specified
            check(options, {
                calendar_id: String,
                event_id: String,
                start: String,
                end: String,
                summary: String,
                description: String,
                tzid: String
            });
            check(callback, Function);
            this.checkLinkedCalendar((status, res) => {
                if (status == 'success') {
                    options = _.extend({
                        access_token: self.user.services.cronofy.accessToken
                    }, options);
                    cronofy.createEvent(options, Meteor.bindEnvironment((err, res) => {
                        if (!err) {
                            callback('success', res);
                        } else {
                            Winston.log('error', this.attachUserId("Cronofy - createEvent - unable to create event."), options);
                            callback('error');
                        }
                    }));
                } else {
                    callback(status, res);
                }
            });
        },
        deleteEvent: function (options, callback) {
            //Delete specified calendar event
            check(options, {
                event_id: String
            });
            check(callback, Function);
            this.checkLinkedCalendar((status, res) => {
                if (status == 'success') {
                    options = _.extend({
                        calendar_id: 'cal_Vpg1U7TM0HgKADQw_pjFndgu883IoFKuKDX0Lyw',
                        access_token: self.user.services.cronofy.accessToken
                    }, options);

                    cronofy.deleteEvent(options, Meteor.bindEnvironment((err, res) => {
                        if (!err) {
                            callback('success', res);
                        } else {
                            Winston.log('error', this.attachUserId("Cronofy - deleteEvent - unable to delete event."), options, err);
                            callback('error');
                        }
                    }));
                } else {
                    callback(status, res);
                }
            });
        },
        readEvents: function (options, callback) {
            //Read all events for the options specified
            check(options, {
                from: String,
                to: String,
                tzid: String,
                include_deleted: Boolean,
                include_managed: Boolean
            });
            check(callback, Function);
            this.checkLinkedCalendar((status, res) => {
                if (status == 'success') {
                    options = _.extend({
                        access_token: self.user.services.cronofy.accessToken
                    }, options);

                    cronofy.readEvents(options, Meteor.bindEnvironment((err, res) => {
                        if (!err) {
                            console.log("readEvents success callback ...");
                            callback('success', res);
                        } else {
                            Winston.log('error', this.attachUserId("Cronofy - readEvents - unable to read events."), options, err);
                            callback('error');
                        }
                    }));
                } else {
                    callback(status, res);
                }
            });
        },
        loadEvents: function(options, callback) {
            this.readEvents(options, (status, res) => {
                if (status == 'success') {
                    console.log('loadEvents readEvents success');
                    const usercalendar = UserCalendars.findOne({userId: self.userId});
                    //console.dir(usercalendar);

                    var userevent = new UserEvent();
                    console.log('a.1');
                    let page = new cal_Page();
                    let i = 0, j = 0;
                    page.set('current',res.pages.current);
                    page.set('total',res.pages.total);
                    page.set('next_page',res.pages.next_page ? res.pages.next_page : '');
                    userevent.set('userId',this.userId);
                    userevent.set('pages',page);
                    console.log('b len: ' + res.events.length);
                    for (i=0; i < res.events.length; i++){
                        //console.log('c i: ' + i);
                        let evt = new cal_Event();
                        let cronofy = res.events[i];
                        let calId = cronofy.calendar_id ? cronofy.calendar_id : '';
                        let cal = usercalendar.findCalendar(calId);
                        evt.set('linkedCalendar',cal);

                        evt.set('calendar_id',calId);
                        evt.set('created',cronofy.created);
                        evt.set('deleted',cronofy.deleted);
                        evt.set('description',cronofy.description ? cronofy.description : '');
                        evt.set('end',cronofy.end);
                        evt.set('event_id',cronofy.event_id ? cronofy.event_id : '');
                        evt.set('event_uid',cronofy.event_uid ? cronofy.event_uid : '');
                        evt.set('event_status',cronofy.event_status ? cronofy.event_status : '');
                        evt.set('participation_status',cronofy.participation_status ? cronofy.participation_status : '');
                        evt.set('start',cronofy.start);
                        evt.set('status',cronofy.status);
                        evt.set('summary',cronofy.summary ? cronofy.summary : '');
                        evt.set('transparency',cronofy.transparency ? cronofy.transparency : '');
                        evt.set('updated',cronofy.updated);

                        for (j=0; j < cronofy.attendees.length; j++){
                            let attendee = new cal_Attendee;
                            attendee.set('email',cronofy.attendees[j].email ? cronofy.attendees[j].email : '');
                            attendee.set('email',cronofy.attendees[j].display_name ? cronofy.attendees[j].display_name : '');
                            attendee.set('email',cronofy.attendees[j].status ? cronofy.attendees[j].status : '');
                            evt.push('attendees',attendee);
                        }
                        let loc = new cal_Location;
                        loc.set('description',cronofy.location ? cronofy.location : '');
                        evt.set('location',loc);
                        userevent.push('events',evt);
                    }
                    console.dir(userevent);
                    console.log('d');
                    userevent.save();

                } else {
                    callback(status, res);
                }
            });

        },
        newLinkedCalendar: function (cal) {
            //Used to build a new linked calendar
            check(cal, {
                    provider_name: String, profile_id: String, profile_name: String, calendar_id: String,
                    calendar_name: String, calendar_readonly: Boolean, calendar_deleted: Boolean, calendar_primary: Boolean
                }
            );
            var linkedCalendar = new LinkedCalendar();
            linkedCalendar.set('provider_name', cal.provider_name);
            linkedCalendar.set('provider_id', cal.provider_id);
            linkedCalendar.set('profile_name', cal.profile_name);
            linkedCalendar.set('calendar_id', cal.calendar_id);
            linkedCalendar.set('calendar_name', cal.calendar_name);
            linkedCalendar.set('calendar_readonly', cal.calendar_readonly);
            linkedCalendar.set('calendar_deleted', cal.calendar_deleted);
            linkedCalendar.set('calendar_primary', cal.calendar_primary);
            linkedCalendar.set('selected', false);
            return linkedCalendar;
        },
        updateLinkedCalendar: function (userCal, cal) {
            check(cal, {
                    provider_name: String, profile_id: String, profile_name: String, calendar_id: String,
                    calendar_name: String, calendar_readonly: Boolean, calendar_deleted: Boolean, calendar_primary: Boolean
                }
            );
            var j = 0, match = false;
            for (j = 0; j < userCal.availCalendars.length; j++) {
                if (userCal.availCalendars[j].calendar_id == cal.calendar_id) {
                    match = true;
                    userCal.availCalendars[j].set('calendar_name', cal.calendar_name);
                    userCal.availCalendars[j].set('calendar_readonly', cal.calendar_readonly);
                    userCal.availCalendars[j].set('calendar_deleted', cal.calendar_deleted);
                    userCal.availCalendars[j].set('calendar_primary', cal.calendar_primary);
                    break;
                }
            }
            return match;
        },
        updateUserCalendar: function (callback) {
            //Update the current user's calendars
            check(callback, Function);
            var that = this;
            console.log('inside updateUserCalendar userId: ' + self.userId);
            this.calendarList((status, res) => {
                console.log('back from call from calendarList');
                var match = false, newLinkedCals = [];
                if (status == 'success') {
                    var userCal = UserCalendars.findOne({userId: self.userId});
                    if (userCal) {
                        res.calendars.map(function (cal, i) {
                            if (!that.updateLinkedCalendar(userCal, cal)) {
                                newLinkedCals.push(that.newLinkedCalendar(cal));
                            }
                        });
                        //Done this way due to mongo err: Exception in callback of async function: MongoError:
                        //Cannot update 'availCalendars' and 'availCalendars.0.calendar_name' at the same time
                        userCal.save();
                        for (n = 0; n < newLinkedCals.length; n++) {
                            userCal.push('availCalendars', newLinkedCals[n]);
                        }
                        userCal.save();
                        console.log("after userCal.save");
                    } else {
                        userCal = new UserCalendar();
                        userCal.set('userId',self.userId);
                        res.calendars.map(function (cal, i) {
                            userCal.push('availCalendars', that.newLinkedCalendar(cal));
                        });
                        userCal.save();
                        console.log("after new userCal.save");
                    }

                } else {
                    callback(status)
                }
            })
        }
    }
}
export default cronofyHelper;