import cronofy from 'cronofy';
import {UserCalendars} from '/libs/collections';


const cronofyHelper = function(userId) {
    var self = this;
    this.userId = userId;
    this.user = Meteor.users.findOne({_id: this.userId});
    return {
        hasLinkedCalendar: function () {
            return self.user && self.user.services.cronofy ? true : false;
        },
        currentUserId: function(){
            console.log("currentUserId self.userId: " + self.userId);
            return self.userId || "no user id";
        },
        currentUser: function () {
            return Meteor.users.findOne({_id: self.userId});
        },
        addUserId: function (errMsg) {
            check(errMsg, String);
            return errMsg + " for userId: " + this.currentUserId();
        },
        isExpired: function () {
            if (this.hasLinkedCalendar()) {
                let user = this.currentUser();
                return moment().toDate() > self.user.services.cronofy.expiresAt;
            } else {
                console.log("isExpired ... no linked calendar");
                return true;
            }
        },
        config: function () {
            var config = ServiceConfiguration.configurations.findOne({service: 'cronofy'});
            if (!config) {
                Winston.log('error', this.addUserId("Service configuration error.  Service 'cronofy'"));
                throw new ServiceConfiguration.ConfigError();
            }
            return config;
        },
        checkLinkedCalendar: function (callback) {
            //check(userId, String);
            check(callback, Function);
            //For testing ... to make access token expired on purpose
            //Meteor.users.update({_id:Meteor.userId()},{$set:{"services.cronofy.expiresAt":moment().add(-50000,'s').toDate()}});
            if (!this.hasLinkedCalendar()) {
                Winston.log('error', this.addUserId("Cronofy - checkLinkedCalendar - no linked calendar found"));
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
            check(callback, Function);
            //Don't call checkLinkedCalendar here!  Infinite loop.
            //this.checkLinkedCalendar(callback);
            //var self = this;
            let user = this.currentUser();
            if (!this.hasLinkedCalendar()) {
                Winston.log('error', this.addUserId("Cronofy - refreshAccessToken - no linked calendar found"));
                callback('error');
            } else {
                var config = this.config();
                var options = {
                    client_id: config.client_id,
                    client_secret: config.client_secret,
                    grant_type: 'refresh_token',
                    refresh_token: self.user.services.cronofy.refreshToken
                };
                cronofy.refreshAccessToken(options, Meteor.bindEnvironment(function (err, res) {
                    if (!err) {
                        //why are you getting logged in user when all you need is the userId?
                        Meteor.users.update({_id: self.userId}, {$set: {"services.cronofy.accessToken": res.access_token}});
                        Meteor.users.update({_id: self.userId}, {$set: {"services.cronofy.refreshToken": res.refresh_token}});
                        Meteor.users.update({_id: self.userId}, {$set: {"services.cronofy.expiresAt": moment().add(res.expires_in, 's').toDate()}});
                        callback('success', res);
                    } else {
                        Winston.log('error', self.addUserId("Cronofy - refreshAccessToken - unable to refresh access token"), err);
                        callback('error');
                    }
                }));
            }
        },
        revokeAuthorization: function (callback) {
            check(callback, Function);
            //var self = this;
            let user = this.currentUser();
            this.checkLinkedCalendar(function (status, res) {
                if (status == 'success') {
                    var config = this.config();
                    var options = {
                        client_id: config.client_id,
                        client_secret: config.client_secret,
                        token: self.user.services.cronofy.accessToken
                    };
                    cronofy.revokeAuthorization(options, Meteor.bindEnvironment(function (err, res) {
                        if (!err) {
                            callback('success', res);
                        } else {
                            Winston.log('error', self.addUserId("Cronofy - revokeAuthorization - unable to revoke authorization"), err);
                            callback('error');
                        }
                    }));
                } else {
                    callback(status, res);
                }
            });
        },
        calendarList: function (callback) {
            check(callback, Function);
            //var self = this;
            //let user = this.currentUser();
            this.checkLinkedCalendar(function (status, res) {
                if (status == 'success') {
                    var options = {
                        access_token: self.user.services.cronofy.accessToken
                    };
                    cronofy.listCalendars(options, Meteor.bindEnvironment(function (err, res) {
                        if (!err) {
                            Winston.log('info', 'success in calendarList');
                            callback('success', res);
                        } else {
                            Winston.log('error', self.addUserId("Cronofy - calendarList - unable to fetch calendar list"), err);
                            callback('error');
                        }
                    }));
                } else {
                    callback(status, res);
                }
            });
        },
        userProfile: function (callback) {
            check(callback, Function);
            //var self = this;
            let user = this.currentUser();
            this.checkLinkedCalendar(function (status, res) {
                if (status == 'success') {
                    var options = {
                        access_token: self.user.services.cronofy.accessToken
                    };
                    cronofy.profileInformation(options, Meteor.bindEnvironment(function (err, res) {
                        if (!err) {
                            callback('success', res);
                        } else {
                            Winston.log('error', self.addUserId("Cronofy - userProfile - unable to fetch profile information"), err);
                            callback('error');
                        }
                    }));
                } else {
                    callback(status, res);
                }
            });
        },
        freeBusy: function (options, callback) {
            check(options, {from: String, to: String, tzid: String});
            check(callback, Function);
            this.checkLinkedCalendar(callback);
            //var self = this;
            let user = this.currentUser();
            this.checkLinkedCalendar(function (status, res) {
                if (status == 'success') {
                    options = _.extend(options, {
                        access_token: self.user.services.cronofy.accessToken
                    });
                    cronofy.freeBusy(options, Meteor.bindEnvironment(function (err, res) {
                        if (!err) {
                            callback('success', res);
                        } else {
                            Winston.log('error', self.addUserId("Cronofy - freeBusy - unable to fetch free-busy information."), options, err);
                            callback('error');
                        }
                    }));
                } else {
                    callback(status, res);
                }
            });
        },
        createEvent: function (options, callback) {
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
            //var self = this;
            let user = this.currentUser();
            this.checkLinkedCalendar(function (status, res) {
                if (status == 'success') {
                    options = _.extend({
                        access_token: self.user.services.cronofy.accessToken
                    }, options);
                    cronofy.createEvent(options, Meteor.bindEnvironment(function (err, res) {
                        if (!err) {
                            callback('success', res);
                        } else {
                            Winston.log('error', self.addUserId("Cronofy - createEvent - unable to create event."), options, err);
                            callback('error');
                        }
                    }));
                } else {
                    callback(status, res);
                }
            });
        },
        deleteEvent: function (options, callback) {
            check(options, {
                event_id: String
            });
            check(callback, Function);
            //var self = this;
            let user = this.currentUser();
            this.checkLinkedCalendar(function (status, res) {
                if (status == 'success') {
                    options = _.extend({
                        calendar_id: 'cal_Vpg1U7TM0HgKADQw_pjFndgu883IoFKuKDX0Lyw',
                        access_token: self.user.services.cronofy.accessToken
                    }, options);

                    cronofy.deleteEvent(options, Meteor.bindEnvironment(function (err, res) {
                        if (!err) {
                            console.log("success deleting event");
                            callback('success', res);
                        } else {
                            Winston.log('error', self.addUserId("Cronofy - deleteEvent - unable to delete event."), options, err);
                            callback('error');
                        }
                    }));
                } else {
                    callback(status, res);
                }
            });
        },
        readEvents: function (options, callback) {
            //check(userId, String);
            check(options, {
                from: String,
                to: String,
                tzid: String,
                include_deleted: Boolean,
                include_managed: Boolean
            });
            check(callback, Function);
            //var self = this;
            let user = this.currentUser();
            this.checkLinkedCalendar(function (status, res) {
                if (status == 'success') {
                    options = _.extend({
                        access_token: self.user.services.cronofy.accessToken
                    }, options);

                    cronofy.readEvents(options, Meteor.bindEnvironment(function (err, res) {
                        if (!err) {
                            callback('success', res);
                        } else {
                            Winston.log('error', self.addUserId("Cronofy - readEvents - unable to read events."), options, err);
                            callback('error');
                        }
                    }));
                } else {
                    callback(status, res);
                }
            });
        },
        newLinkedCalendar: function (cal) {
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
            //check(userCal,Object);
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
            check(callback, Function);
            var that = this;
            this.calendarList(function (status, res) {
                var match = false, newLinkedCals = [];
                if (status == 'success') {
                    var userCal = UserCalendars.findOne({userId: self.userId});
                    if (userCal) {
                        res.calendars.map(function (cal, i) {
                            if (!that.updateLinkedCalendar(userCal, cal)) {
                                newLinkedCals.push(self.newLinkedCalendar(cal));
                            }
                        });
                        //Done this way due to mongo err: Exception in callback of async function: MongoError:
                        //Cannot update 'availCalendars' and 'availCalendars.0.calendar_name' at the same time
                        userCal.save();
                        for (n = 0; n < newLinkedCals.length; n++) {
                            userCal.push('availCalendars', newLinkedCals[n]);
                        }
                        userCal.save();
                    } else {
                        userCal = new UserCalendar();
                        res.calendars.map(function (cal, i) {
                            userCal.push('availCalendars', self.newLinkedCalendar(cal));
                        });
                        userCal.save();
                    }

                } else {
                    callback(status)
                }
            })
        }
    }
}
export default cronofyHelper;