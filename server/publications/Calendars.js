import {UserCalendars} from '/libs/collections';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

Meteor.publish('usercalendars.list', function () {
    const selector = {userId: this.userId};
    const options = {};

    return UserCalendars.find(selector, options);
});

//Meteor.publish('calendars.single', function (calendarId) {
//    check(calendarId, String);
//    const selector = {calendarId: calendarId};
//    return Calendars.find(selector);
//});
