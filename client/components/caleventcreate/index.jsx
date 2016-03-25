// XXX: We need to find a way to use npm's react
// Otherwise, we can't run tests properly.
// To test this component, use React from npm directly
// as shown below
import React from 'react';
// import React from 'react';
import DateTime from 'react-datetime';

class CalEventCreate extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            'from': moment(),
            'to': moment()
        };
    }

    handleSave(){
        console.log("handleSave");

    }
    handleChange(source,m){
        this.setState({[source]: m});
    }

    render() {
        const {error} = this.props;
        //console.log('from: ' + this.state.from);
        //console.log('to: ' + this.state.to);

        return (
            <div className="new-post">
                <h2>Add New Event</h2>
                {error ? <p style={{color: 'red'}}>{error}</p> : null}
                <DateTime onChange={this.handleChange.bind(this,'from')} inputProps={{'placeholder':'From'}} defaultValue={this.state.from}/>
                <DateTime onChange={this.handleChange.bind(this,'to')} inputProps={{'placeholder':'To'}} defaultValue={this.state.to}/>
                <input ref="titleRef" type="Text" placeholder="Title." /> <br/>
                <textarea ref="contentRef" placeholder="Description." /> <br/>
                <button onClick={this.createEvent.bind(this)}>Add New</button>
            </div>
        );
    }

    createEvent() {
        console.log("createEvent");
        const {create,calendarId} = this.props;
        const {titleRef, contentRef} = this.refs;
        const date = new Date();
        const start = this.state.from;
        const end = this.state.to;
        const event_id = Random.id();
        Session.set('event_id', event_id);
        //console.log('event_id: ' + event_id);
        var options = {
            calendar_id: calendarId,
            event_id: event_id,
            start: start.format(),
            end: end.format(),
            summary: titleRef.value,
            description: contentRef.value,
            tzid:"America/Los_Angeles"
        }
        create(options);
    }
}

export default CalEventCreate;
