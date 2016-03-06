import cronofy from 'cronofy';
import {UserCalendars} from '/libs/collections';

const cronofyHelperX = function(userId) {
    var self = this;

    return {
        test(callback){
            console.log("inside cronofyHelperX test userId: " + self.userId);
            callback("self.userId: " + self.userId);
        }
    }
}
export default cronofyHelperX;