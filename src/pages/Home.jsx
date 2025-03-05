import React from 'react'
import Layout from '../components/layout/Layout'
import HomeDash from '../components/homeDash/HomeDash'

export default function Home() {
  return (
    <div>
        <div className="flex flex-col min-h-screen">
            <Layout>
                <HomeDash />
            </Layout>
        </div>
    </div>
  )
}
