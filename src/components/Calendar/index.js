import React from 'react';
import { compose } from 'recompose';
import * as ROLES from '../../constants/roles';
import { withAuthorization, withEmailVerification,AuthUserContext } from '../Session';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import events from './events'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Header,
} from 'semantic-ui-react';

class Calendar extends React.Component {
  constructor(...props) {
    super(...props)

    this.state = { events,
  }
}
componentDidMount(){
  this.getEvents()
}
  getEvents = () =>{
    let token = JSON.parse(localStorage.getItem('authUser'))
    this.props.firebase.user(token.uid)
    .once('value')
    .then(snapshot => {
      const dbUser = snapshot.val();
      let w = dbUser.workouts
      if (w){
        var newArrayDataOfOjbect = Object.values(w)
        newArrayDataOfOjbect.forEach(function(element) {
          element.end = new Date(element.end)
          element.start = new Date(element.start)
          
        });
        this.setState({events: newArrayDataOfOjbect})
      }
    });

  }

  handleSelect = ({ start, end }) => {
    const title = window.prompt('New Event name')
    if (title)
      this.setState({
        events: [
          ...this.state.events,
          {
            start,
            end,
            title,
          },
        ],
      })
  }

  render() {
    const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer
    return (
          <AuthUserContext.Consumer>
    {authUser => (
      <div style={{height:'750px'}}>
        <Header as="h2">{authUser.username}'s Calendar</Header>
      <BigCalendar
          selectable
          localizer={localizer}
          startAccessor="start"
          endAccessor="end"
          events={this.state.events}
          defaultView={BigCalendar.Views.AGENDA}
          scrollToTime={new Date(1970, 1, 1, 6)}
          defaultDate={new Date(2019, 3, 12)}
          onSelectEvent={event => alert(event.title)} 
          onSelectSlot={this.handleSelect}
        />
      </div>
    )}
  </AuthUserContext.Consumer>
      
    )
  }
}


// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.




const condition = authUser =>
  authUser && authUser.roles.includes(ROLES.ADMIN);

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(Calendar);
