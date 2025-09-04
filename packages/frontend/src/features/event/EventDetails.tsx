import React from 'react';
import { CohortEvent } from '@base-project/shared/';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/Card';
interface EventDetailsProps {
    event: CohortEvent
}

const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
    const styles = {
        container: {
            border: '1px solid #ff338f',
            margin: '10px 0',
        },
        title: {
            fontSize: '1.5em',
            margin: '0 0 10px 0',
        },
        description: {
            fontStyle: 'italic',
        },
        date: {
            margin: '5px 0',
        },
    };

    return (
        <>
        <Card className="my-custom-class" style={styles.container}>
        <CardHeader>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription><strong>Description:</strong> {event.description}</CardDescription>
        </CardHeader>
        <CardContent>
            <p><strong>Start Date:</strong> {new Date(event.startTime).toLocaleString()}</p>
            <p><strong>End Date:</strong> {new Date(event.endTime).toLocaleString()}</p>
        </CardContent>
        </Card>
    </>
    )
};

export default EventDetails;
