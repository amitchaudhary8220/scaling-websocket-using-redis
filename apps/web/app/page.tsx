'use client'
import { useState } from 'react';
import { useSocket } from './context/SocketProvider'
import classes from './page.module.css'

export default function Page() {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState('')
  return (
    <div>

      <div className={classes["chat-container"]}>
        <input value={message} onChange={(e) => setMessage(e.target.value)} className={classes['chat-input']} placeholder="Message..." />
        <button onClick={() => { sendMessage(message) }} className={classes['button']}>Send</button>
      </div>
      <div>
        <h1>All Message will appear here</h1>
        <div>{messages?.map((item, i) => <ul>{` ${i + 1} ${item}`}</ul>)}</div>
      </div>
    </div>
  )
}

