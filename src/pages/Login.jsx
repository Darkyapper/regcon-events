import React from 'react'
import LayoutSecond from '../components/layout/LayoutSecond'
import LoginForm from '../components/loginForm/LoginForm'

export default function Login() {
  return (
    <div>
      <div className="flex flex-col min-h-screen">
        <LayoutSecond>
          <LoginForm />
        </LayoutSecond>
      </div>
    </div>
  )
}
