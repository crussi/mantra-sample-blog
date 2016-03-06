import {UserCalendars} from '/libs/collections';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

export default function () {
    Meteor.methods({
        'calendarlist.select'(calendar_id) {
            check(calendar_id, String);

            //const post = {
            //    _id, title, content, createdAt,
            //    saving: true
            //};
            //UserCalendars.update({_id:_id},);
            console.log("stub");
            //var i = 0;
            //var userCal = UserCalendars.findOne({userId:Meteor.userId()});
            UserCalendars.update({userId:Meteor.userId(),"availCalendars.calendar_id":calendar_id},{$set:{"availCalendars.$.selected":true}});
            //console.log("userId: " + Meteor.userId());
            //console.dir(userCal);
            //UserCalendars.update({_id:userCal._id,'availCalendars.calendar_id':calendar_id},{$set:{'availCalendars.$.selected':true}});
            //if (userCal && userCal.availCalendars) {
            //    for (i=0;i<userCal.availCalendars.length;i++){
            //        if (userCal.availCalendars[i].calendar_id == calendar_id){
            //            console.log("found it, updating it");
            //            //userCal.availCalendars[i].set('selected',!userCal.availCalendars[i].selected);
            //            UserCalendars.update({_id:userCal._id,'availCalendars.calendar_id':calendar_id},{$set:{'availCalendars.$.selected':true}})
            //            break;
            //        }
            //    }
            //    //userCal.save();
            //}

            //console.log('after update');
            //var userCal = UserCalendars.findOne({userId:Meteor.userId()});
            //console.dir(userCal);
        }
    });
}
