//import {Calendars} from '/libs/collections';
//import {Meteor} from 'meteor/meteor';
//import {check} from 'meteor/check';
//
//Meteor.publish('calendars.list', function () {
//    const selector = {};
//    const options = {
//        fields: {_id: 1, name: 1},
//        sort: {name: 1}
//    };
//
//    return Calendars.find(selector, options);
//});
//
//Meteor.publish('calendars.single', function (calendarId) {
//    check(calendarId, String);
//    const selector = {calendarId: calendarId};
//    return Calendars.find(selector);
//});
