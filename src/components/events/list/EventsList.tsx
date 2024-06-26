import "./EventsList.css";
import Event from "../../../types/Event";
import useFetch from "../../../hooks/useFetch";
import { getEvents } from "../../../services/eventService";
import { useCallback } from "react";
import EventListItem from "./EventListItem";
import FetchedDataLayout from "../../../layouts/FetchedDataLayout";

/**
 * Renders a list of events
 *
 * @component
 * @param {number} limit - The maximum number of events to display (optional)
 * @returns {JSX.Element} The rendered component.
 */
const EventsList = ({ limit }: { limit?: number }): JSX.Element => {
  const fetchEvents = useCallback(() => getEvents(limit), [limit]);
  const { pending, data: events, error } = useFetch<Event[]>(fetchEvents);

  return (
    <div className="events__container">
      <FetchedDataLayout isPending={pending} error={error}>
        {events && events.length === 0 && (
          <p>
            Er zijn geen activiteiten gepland in de toekomst. Raadpleeg onze{" "}
            <a
              href="https://www.facebook.com/KSA.Oosterzele/"
              className="cursive"
              target="_blank" rel="noreferrer"
            >
              facebookpagina
            </a>{" "}
            voor actuele info.
          </p>
        )}
        <div className={`events-list`}>
          {events &&
            events.map((event) => (
              <EventListItem key={event.id} event={event} enableWrap />
            ))}
        </div>
      </FetchedDataLayout>
    </div>
  );
};

export default EventsList;
