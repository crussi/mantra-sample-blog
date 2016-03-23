// XXX: We need to find a way to use npm's react
// Otherwise, we can't run tests properly.
// To test this component, use React from npm directly
// as shown below
import React from 'react';
// import React from 'react';
import DateTime from 'react-datetime';

class CalEventCreate extends React.Component {
    getInitalState(){
        return {
            m: moment()
        };
    }
    handleSave(){
        console.log("handleSave");

    }
    handleChange(){
        console.log("handleChange");
        this.setState({m: m});
    }

    render() {
        const {error} = this.props;
        return (
            <div className="new-post">
                <h2>Add New Event</h2>
                {error ? <p style={{color: 'red'}}>{error}</p> : null}
                <DateTime/>
                <input ref="titleRef" type="Text" placeholder="Title." /> <br/>
                <textarea ref="contentRef" placeholder="Description." /> <br/>
                <button onClick={this.createEvent.bind(this)}>Add New</button>
            </div>
        );
    }

    createEvent() {
        console.log("createEvent");
        const {create} = this.props;
        //const {titleRef, contentRef} = this.refs;
        const date = new Date();
        const start = moment(date).add(1,'h').utc().format("YYYY-MM-DDTHH:mm:ss") + "Z";
        const end = moment(date).add(2,'h').utc().format("YYYY-MM-DDTHH:mm:ss") + "Z";
        const event_id = Random.id();
        Session.set('event_id', event_id);
        console.log('event_id: ' + event_id);
        var options = {
            event_id: event_id,
            start: start,
            end: end,
            summary: "hello world",
            description: "Meet at Starbucks to say, hello world!",
            tzid:"America/Los_Angeles"
        }
        create(options);
    }
}

export default CalEventCreate;
