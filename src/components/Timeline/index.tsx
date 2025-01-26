import React from 'react';
import Modal from '../modal';
import moment from 'moment';

interface Event {
    status: string;
    description: string;
    date: string;
}

interface TimelineProps {
    events: Event[];
    onClose: () => void
}

const TimelineView: React.FC<TimelineProps> = ({ events, onClose }) => {
    return (
        <Modal isOpen onClose={onClose}>
        <Modal.Header>Track Status</Modal.Header>
        <Modal.Content>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300" />
            <div className="space-y-8">
              {events.map((event, index) => (
                <div key={index} className="relative flex items-start space-y-4">
                  <div className="flex-1 border rounded-lg shadow-sm p-4 bg-white">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">{event.status}</h4>
                        <p className="text-sm text-gray-600">{event.description}</p>
                      </div>
                      <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded">
                        {moment(event.date).format('YYYY-MM-DD ddd HH:mm a')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal.Content>
      </Modal>
    );
};

export default TimelineView;