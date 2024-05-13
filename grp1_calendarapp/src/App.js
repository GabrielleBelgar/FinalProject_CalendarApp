import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

const locales = {
    "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

// DUMMY DATA
const events = [
    {
        id: 0,
        title: "Big Meeting",
        allDay: true,
        start: new Date(2021, 6, 0),
        end: new Date(2021, 6, 0),
    },
    {
        id: 1,
        title: "Vacation",
        start: new Date(2021, 6, 7),
        end: new Date(2021, 6, 10),
    },
    {
        id: 2,
        title: "Conference",
        start: new Date(2021, 6, 20),
        end: new Date(2021, 6, 23),
    },
];

const Popup = ({ event, onDelete, showPopup, setShowPopup, onEdit }) => {
  // Check if event is null or undefined
  if (!showPopup || !event) {
    return null;
  }

  // Initialize editedEvent with event if not editing
  const [editedEvent, setEditedEvent] = useState(event);
  // Initialize isEditing state to false
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(editedEvent);
    setShowPopup(false);
  };

  const handleDelete = () => {
    onDelete(event.id);
    setShowPopup(false);
    alert("Event has been successfully deleted!");
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <div className="popup">
      <div className="popup-content">
        {isEditing ? (
          <>
            <div>
              <div>
                Title:{" "}
                <input
                  type="text"
                  value={editedEvent.title}
                  onChange={(e) =>
                    setEditedEvent({ ...editedEvent, title: e.target.value })
                  }
                />
              </div>
              <div>
                Start:{" "}
                <DatePicker
                  selected={editedEvent.start}
                  onChange={(date) =>
                    setEditedEvent({ ...editedEvent, start: date })
                  }
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  timeCaption="Time"
                />
              </div>
              <div>
                End:{" "}
                <DatePicker
                  selected={editedEvent.end}
                  onChange={(date) =>
                    setEditedEvent({ ...editedEvent, end: date })
                  }
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  timeCaption="Time"
                />
              </div>
            </div>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleClose}>Cancel</button>
          </>
        ) : (
          <>
            <div>
              <div>Title: {event.title}</div>
              <div>Start: {format(event.start, "MMMM d, yyyy h:mm a")}</div>
              <div>End: {format(event.end, "MMMM d, yyyy h:mm a")}</div>
            </div>
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={handleClose}>Close</button>
          </>
        )}
      </div>
    </div>
  );
};

function App() {
    const [newEvent, setNewEvent] = useState({ id: Date.now(), title: "", start: "", end: "" });
    const [allEvents, setAllEvents] = useState(events);
    const [showPopup, setShowPopup] = useState(false);
    const [popupEvent, setPopupEvent] = useState(null);     

    function handleAddEvent() {
        
         // Check if the newEvent object contains valid data
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      alert("Please fill in all fields to add an event.");
      return;
  }

  for (let i = 0; i < allEvents.length; i++) {
      const d1 = new Date(allEvents[i].start);
      const d2 = new Date(newEvent.start);
      const d3 = new Date(allEvents[i].end);
      const d4 = new Date(newEvent.end);

      if (((d1 <= d2) && (d2 <= d3)) || ((d1 <= d4) && (d4 <= d3))) {
          alert("Event time overlaps with an existing event.");
          return;
      }
  }

    setAllEvents([...allEvents, newEvent]);
    alert("Event has been successfully added!");

        
        
        setAllEvents([...allEvents, newEvent]);
        alert("Event has been successfully added!");

    }

      const handleDeleteEvent = (id) => {
        const updatedEvents = allEvents.filter((event) => event.id !== id);
        setAllEvents(updatedEvents);
        setShowPopup(false);
      };
    
      function handleEditEvent(editedEvent) {
        const updatedEvents = allEvents.map((event) =>
          event.id === editedEvent.id ? editedEvent : event
        );
        setAllEvents(updatedEvents);
        setShowPopup(false);
        alert("Event has been successfully edited!");
      }
    
      function handleEventClick(event) {
        setPopupEvent(event);
        setShowPopup(true);
      }
    
      return (
        <div className="App">
          <h1>Calendar</h1>
          <h2>Add New Event</h2>
          <div>
            <input
              type="text"
              placeholder="Add Title"
              style={{ width: "20%", marginRight: "10px" }}
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
            />
            <DatePicker
              placeholderText="Start Date"
              selected={newEvent.start}
              onChange={(date) => setNewEvent({ ...newEvent, start: date })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              timeCaption="Time"
              style={{ marginRight: "10px" }}
            />
            <DatePicker
              placeholderText="End Date"
              selected={newEvent.end}
              onChange={(date) => setNewEvent({ ...newEvent, end: date })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              timeCaption="Time"
              style={{ marginRight: "10px" }}
            />
            <button onClick={handleAddEvent}>Add Event</button>
          </div>
          <Calendar
            localizer={localizer}
            events={allEvents}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={handleEventClick}
            selectable={true}
            views={["month", "week", "day"]}
            style={{ height: 500, margin: "50px" }}
          />
          <Popup
            event={popupEvent}
            onDelete={handleDeleteEvent}
            onEdit={handleEditEvent}
            showPopup={showPopup}
            setShowPopup={setShowPopup}
          />
        </div>
      );
    }
    
    export default App;