import API_BASE_URL from "../config";
import ErrorResponse from "../types/ErrorResponse";
import Event from "../types/Event";

export async function getEvents(limit?: number): Promise<Event[]> {
    try {
        const response = await fetch(`${API_BASE_URL}?page=events&limit=${limit}`, {
            method: 'GET',
            credentials: 'include',
        });

        if(!response.ok) {
            throw await ErrorResponse.createFromResponse(response);
        }

        const data = await response.json();
        const events = data.map((eventData: any) => new Event(eventData));
        return events;
    } catch (error) {
        throw error;
    }
}

export async function addEvent(event: Event) {
    try {
        const response = await fetch(`${API_BASE_URL}?page=event`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                page: 'addEvent',
                name: event.name,
                description: event.description,
                location: event.location,
                date: event.datetime,
                imgpath: event.imageFileName,
                url: event.url,
                bigEvent: event.featured,
            }),
            credentials: 'include',
        });

        if (!response.ok) {
            throw await ErrorResponse.createFromResponse(response);
        }
    } catch (error) {
        throw error;
    }
}

export async function updateEvent(event: Event) {
    try {
        const response = await fetch(`${API_BASE_URL}?page=event`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
            credentials: 'include',
        });

        if (!response.ok) {
            throw await ErrorResponse.createFromResponse(response);
        }
    } catch (error) {
        throw error;
    }
}


export async function getEvent(id: number): Promise<Event> {
    try {
        const response = await fetch(`${API_BASE_URL}?page=event&id=${id}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw await ErrorResponse.createFromResponse(response);
        }

        const data = await response.json();
        return new Event(data);
    } catch (error) {
        throw error;
    }
}

export async function getImagePaths() {
    try {
        const response = await fetch(`${API_BASE_URL}?page=event_images`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw await ErrorResponse.createFromResponse(response);
        }

        const data = response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Er was een probleem bij het ophalen van de afbeeldingen.');
    }
}

export async function deleteEvent(id: number) {
    try {
        const response = await fetch(`${API_BASE_URL}?page=event&id=${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            throw await ErrorResponse.createFromResponse(response);
        }
    } catch (error) {
        throw error;
    }
}

export async function getPastEvents() {
    try {
        const response = await fetch(`${API_BASE_URL}?page=past_events`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw await ErrorResponse.createFromResponse(response);
        }

        return response.json();
    } catch (error) {
        throw new Error('Er was een probleem bij het ophalen van de activiteiten.');
    }
}