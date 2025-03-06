import React from 'react'
import Layout from '../components/layout/Layout'
import EventDetails from '../components/eventDetails/EventDetails'


export default function EventPage() {
  return (
    <div>
        <div className="flex flex-col min-h-screen">
            <Layout>
                <EventDetails />
            </Layout>
        </div>
    </div>
  )
}
