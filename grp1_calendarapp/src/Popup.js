import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const Popup = ({ event, setShowPopup, onDeleteEvent, onEditEvent }) => {
    // Check if event is null or undefined
    if (!event) {
      return null;
    }
  
    // Initialize editedEvent with event if not editing
    const [editedEvent, setEditedEvent] = useState(event);
    // Initialize isEditing state to false
    const [isEditing, setIsEditing] = useState(false);
    const [newCategory, setNewCategory] = useState(event.category);
    const [selectedColor, setSelectedColor] = useState(editedEvent.style?.backgroundColor || "");
  
    const handleEdit = () => {
      setIsEditing(true);
      setNewCategory(editedEvent.category);
    };
  
    const handleSave = () => {
        const updatedEvent = {
          ...editedEvent,
          category: newCategory,
          style: { backgroundColor: selectedColor },
        };
        onEditEvent(updatedEvent);
        setEditedEvent(updatedEvent); // update editedEvent state
        setSelectedColor(updatedEvent.style.backgroundColor); // update selectedColor state
        setShowPopup(false);
      };
  
    const handleDelete = () => {
      onDeleteEvent(event.id);
      setShowPopup(false);
      
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
                <div className="popup-inner-header-edit">
                  Event Title:{" "}
                  <input
                  className="EventTitle-popup"
                    type="text"
                    value={editedEvent.title}
                    onChange={(e) =>
                      setEditedEvent({ ...editedEvent, title: e.target.value })
                    }
                  />
                </div>
                <div className="popup-inner-header-edit">
                    <div className="popup-datepicker-container">
                    Category:{" "}
                    <input
                    className="popup-datepicker"
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    />
                </div>
                  <div className="popup-datepicker-container">
                    <FontAwesomeIcon icon={faClock} className="ClockIcon-popup" />
                    Start:{" "}
                    <DatePicker
                      className="popup-datepicker"
                      selected={editedEvent.start}
                      onChange={(date) =>
                        setEditedEvent({ ...editedEvent, start: date })
                      }
                      showTimeSelect
                      dateFormat="MMMM d, yyyy h:mm aa"
                      timeCaption="Time"
                    />
                  </div>
                  <div className="popup-datepicker-container">
                  <FontAwesomeIcon icon={faClock} className="ClockIcon-popup" />
                    End:{" "}
                    <DatePicker
                      className="popup-datepicker"
                      selected={editedEvent.end}
                      onChange={(date) =>
                        setEditedEvent({ ...editedEvent, end: date })
                      }
                      showTimeSelect
                      dateFormat="MMMM d, yyyy h:mm aa"
                      timeCaption="Time"
                    />
                  </div>
                  <div className="popup-datepicker-container">
                    <label htmlFor="color">Color:</label>
                    <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    />
                 </div>
                </div>
              </div>
              <button onClick={handleClose} className="Edit-btn">Cancel</button>
              <button onClick={handleSave} className="Delete-btn">Save</button>
             
            </>
          ) : (
            <>
             <div className="popup-inner-header">
             <FontAwesomeIcon icon={faXmark} className="closeIcon" onClick={handleClose} />
                <div className="popup-inner-pair">
                  <div className="popup-inner-title">Event Title:</div>
                  <p className="popup-inner-value">{event.title}</p>
                </div>
                <div className="popup-inner-pair">
                    <div className="popup-inner-title">Category:</div>
                    <p className="popup-inner-value">{event.category}</p>
                </div>
                <div className="popup-inner-pair">
                  <div className="popup-inner-title">Start:</div>
                  <p className="popup-inner-value">{event.start.toLocaleString()}</p>
                </div>
                <div className="popup-inner-pair">
                  <div className="popup-inner-title">End:</div>
                  <p className="popup-inner-value">{event.end.toLocaleString()}</p>
                </div>
              </div>
              <button onClick={handleEdit} className="Edit-btn">Edit</button>
              <button onClick={handleDelete} className="Delete-btn">Delete</button>
            </>
          )}
        </div>
      </div>
    );
  };

  export default Popup;