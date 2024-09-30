'use client'

import React, { useCallback, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client";



interface SocketProviderProps {
    children?: React.ReactNode
}

interface ISocketContext {
    sendMessage: (msg: string) => any;
    messages: Array<string>;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
    const state = useContext(SocketContext);

    if (!state) throw new Error(`state is undefined`);
    return state;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket>()
    const [messages, setMessages] = useState<string[]>([])

    const onMessageRec = useCallback((msg: string) => {
        console.log('from server ', msg);
        const { message } = JSON.parse(msg) as { message: string }

        setMessages((prev) => [...prev, message])
    }, [])


    const sendMessage: ISocketContext['sendMessage'] = useCallback((msg) => {
        if (socket) {
            socket.emit('event:message', { message: msg })
        }

    }, [socket])

    useEffect(() => {
        const _socket = io('http://localhost:8000') // give the url of your backend here

        _socket.on('message', onMessageRec);
        setSocket(_socket);
        return () => {
            _socket.disconnect(); // whenever unmount the component disconnect the socket

            _socket.off('message', onMessageRec)
            setSocket(undefined)
        }
    }, [])

    return (
        <SocketContext.Provider value={{ sendMessage, messages }}>
            {children}
        </SocketContext.Provider>
    )
}