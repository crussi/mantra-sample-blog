//import {Posts} from '/libs/collections';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {UserCalendars} from '/libs/collections';


Meteor.methods({
    'calendarlist.select': function (calendar_id) {
        check(calendar_id,String);
        var i = 0, userCal = UserCalendars.findOne({userId:Meteor.userId()});
        //console.dir(userCal);
        if (userCal && userCal.availCalendars) {
           for (i=0;i<userCal.availCalendars.length;i++){
               if (userCal.availCalendars[i].calendar_id == calendar_id){
                   userCal.availCalendars[i].set('selected',!userCal.availCalendars[i].selected);
                   break;
               }
            }
            userCal.save();
        }
    }
    });
