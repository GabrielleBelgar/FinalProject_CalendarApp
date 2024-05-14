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
import Popup from "./Popup";
import ErrorModal from "./ErrorModal";
import SuccessModal from "./SuccessModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faCalendarPlus } from '@fortawesome/free-regular-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
  format: (date, formatStr, culture) => format(date, formatStr, { locale: locales[culture] }),
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
    style: { backgroundColor: "#f00" },
    category: "meeting",
  },
  {
    id: 1,
    title: "Vacation",
    start: new Date(2021, 6, 7),
    end: new Date(2021, 6, 10),
    style: { backgroundColor:"#0f0" },
    category: "vacation",
  },
  {
    id: 2,
    title: "Conference",
    start: new Date(2021, 6, 20),
    end: new Date(2021, 6, 23),
    style: { backgroundColor: "#00f" },
    category: "conference",
  },
];



function App() {
  const [newEvent, setNewEvent] = useState({
    id: Date.now(),
    title: "",
    start: new Date(),
    end: new Date(),
    category: "",
    color: "",
  });
  const [allEvents, setAllEvents] = useState(events);
  const [showPopup, setShowPopup] = useState(false);
  const [popupEvent, setPopupEvent] = useState(null);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleAddEvent = () => {
    if (
      !newEvent.title ||
      !newEvent.start ||
      !newEvent.end ||
      !newEvent.category ||
      !newEvent.color ||
      JSON.stringify(newEvent) === JSON.stringify({
        id: Date.now(),
        title: "",
        start: null,
        end: null,
        category: "",
        color: "",
      })
    ) {
      setModalMessage("Please fill in all fields to add an event.");
      setErrorModalOpen(true);
      return;
    }
  
    const overlappingEvents = allEvents.filter(
      (event) =>
        !(
          new Date(newEvent.start) >= event.end ||
          new Date(newEvent.end) <= event.start
        )
    );
  
    if (overlappingEvents.length > 0) {
      setModalMessage("Event time overlaps with an existing event.");
      setErrorModalOpen(true);
      return;
    }
  
    const newEventWithDates = {
      ...newEvent,
      start: new Date(new Date(newEvent.start).setHours(
        new Date(newEvent.start).getHours(),
        new Date(newEvent.start).getMinutes(),
        0,
        0
      )),
      end: new Date(new Date(newEvent.end).setHours(
        new Date(newEvent.end).getHours(),
        new Date(newEvent.end).getMinutes(),
        0,
        0
      )),
      style: { backgroundColor: newEvent.color }, // set the style property to include the color property
    };
  
    // Add the new category to the allEvents array if it doesn't already exist
    if (!allEvents.some((event) => event.category === newEvent.category)) {
      setAllEvents([...allEvents, newEventWithDates]);
    }
  
    setAllEvents([...allEvents, newEventWithDates]);
    setSuccessModalOpen(true);
    setModalMessage("Event has been successfully added!");
    setNewEvent({ id:Date.now(), title: "", start: new Date(), end: new Date(), category: "", color: "" });
  };

  const handleCancelEvent = () => {
    setNewEvent({ id: Date.now(), title: "", start: new Date(), end: new Date(), category: "", color: "" });
  };

  const handleDeleteEvent = (id) => {
    const updatedEvents = allEvents.filter((event) => event.id !== id);
    setAllEvents(updatedEvents);
    setShowPopup(false);
    setSuccessModalOpen(true);
    setModalMessage("Event has been successfully deleted!");
  };

  function handleEditEvent(editedEvent) {
    const updatedEvents = allEvents.map((event) =>
      event.id === editedEvent.id ? { ...editedEvent, style: { backgroundColor: editedEvent.style.backgroundColor } } : event
    );
    setAllEvents(updatedEvents);
    setShowPopup(false);
    setSuccessModalOpen(true);
    setModalMessage("Event has been successfully edited!");
    setNewEvent({ id: Date.now(), title: "", start: new Date(), end: new Date(), category: "", color: "" });
  }

  const handleEventClick = (event) => {
    setPopupEvent(event);
    setShowPopup(true);
  };

// Modify the eventStyleGetter function to use the color property of the event if it exists,or a default color otherwise
  const eventStyleGetter = (event) => {
    if (!event) {
      return {};
    }
    return {
      style: {
        backgroundColor: event.style?.backgroundColor || "", // add nullish coalescing operator to avoid undefined error
      },
    };
  };

  return (
    <div className="App">
      <div className="Header">Event Scheduler</div>
      <div className="AddEventGrp">
      <h2 className="AddHeader">Add New Event</h2>

      <FontAwesomeIcon icon={faCalendarPlus} className="EventIcon" />
        <input
        className="EventTitle"
          type="text"
          placeholder="Add Title"
          value={newEvent.title}
          onChange={(e) =>
            setNewEvent({ ...newEvent, title: e.target.value })
          }
        />
        <br></br>
        <div className="DateInput">
            <FontAwesomeIcon icon={faClock} className="ClockIcon" />
            <DatePicker
              className="StartDate"
              placeholderText="Start Date"
              selected={newEvent.start}
              onChange={(date) => setNewEvent({ ...newEvent, start: date })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              timeCaption="Time"
            />
            <DatePicker
              className="EndDate"
              placeholderText="End Date"
              selected={newEvent.end}
              onChange={(date) => setNewEvent({ ...newEvent, end: date })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              timeCaption="Time"
            />
        </div>
        <div>
            <input
            className="category"
              type="text"
              placeholder="Category name"
              value={newEvent.category}
              onChange={(e) =>
                setNewEvent({ ...newEvent, category: e.target.value })
              }
            />
            <input
              type="color"
              value={newEvent.color}
              onChange={(e) =>
                setNewEvent({ ...newEvent, color: e.target.value })
              }
            />
          </div>
                <br></br>
                <button onClick={handleCancelEvent} className="Cancel">Cancel</button>
                <button className="submit-btn" onClick={handleAddEvent}>Add Event</button>
          </div>
          <div className="Calendar">
        <Calendar
        selectable
        localizer={localizer}
        events={allEvents}
        onSelectEvent={(event) => handleEventClick(event)}
        onSelectSlot={(slotInfo) =>
          setNewEvent({
            ...newEvent,
            start: slotInfo.start,
            end:slotInfo.end,
          })
        }
        startAccessor="start"
        endAccessor="end"
        style={{ height: 800 }}
        eventPropGetter={eventStyleGetter}
      />
      {showPopup && (
        <Popup
          event={popupEvent}
          setShowPopup={setShowPopup}
          onDeleteEvent={handleDeleteEvent}
          onEditEvent={handleEditEvent}
        />
      )}
      <ErrorModal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        message={modalMessage}
      />
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message={modalMessage}
      />
      </div>
    </div>
  );
}

export default App;
