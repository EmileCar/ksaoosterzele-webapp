<?php
$eventRoutes = [
    'events' => array(
        'controller' => 'Event',
        'methods' => array(
            'GET' => 'getEvents',
        )
    ),
    'event' => array(
        'controller' => 'Event',
        'methods' => array(
            'GET' => 'getEvent',
            'POST' => 'addEvent',
            'PUT' => 'updateEvent',
            'DELETE' => 'deleteEvent'
        )
    ),
    'event_images' => array(
        'controller' => 'Event',
        'methods' => array(
            'GET' => 'getImagePaths'
        )
    ),
    'all_events' => array(
        'controller' => 'Event',
        'methods' => array(
            'GET' => 'getAllEvents'
        )
    ),
];