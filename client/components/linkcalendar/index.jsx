import React from 'react';

class LinkCalendar extends React.Component {
    render() {
        return (
            <div className="new-post">
                <h2>Link calendar with Cronofy</h2>
                <button onClick={this.linkCalendar.bind(this)}>link</button>
            </div>
        );
    }

    linkCalendar() {
        console.log("flow router /authorize-cronofy");
        var options = {
            redirectUrl:"http://localhost:3000/cronofy"
        };
        Cronofy.requestCredential(options, function (code){
            console.log('flow router request cred cb res: ' + code);
            //console.dir(res);
            Meteor.call('cronofy.requestAccessToken', code, (err) => {
                if (err) {
                    console.log("flow router request cred cb error");
                    console.dir(err);
                    //return LocalState.set('SAVING_ERROR', err.message);
                }
            });
        });
    }
}

export default LinkCalendar;
