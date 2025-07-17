import React from 'react';
import TimelineCard from './components/TimelineCard';
import NewPost from './components/NewPost';

export default function Timeline () {
    return (
        <main className='flex flex-col bg-(--gray) pt-34 pb-6'>
            <TimelineCard><NewPost/></TimelineCard>
        </main>
    )
}