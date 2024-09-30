import { Server } from 'socket.io';
import Redis from 'ioredis'



class SocketService {
    private _io: Server; // type of _io variable is Server

    constructor() {
        console.log('Init socket server in  constructor');
        this._io = new Server({
            cors: { // allow every thing
                allowedHeaders: ["*"],
                origin: '*'
            }
        });
        sub.subscribe("MESSAGES"); // every server subscribe to this channel
    }

    get io() {
        return this._io;
    }

    public initListeners() {
        const io = this.io;
        console.log('Intialized socket listners')
        io.on('connect', (socket) => {
            // at this point new socket connection is reached
            console.log(`New Sockeet connected  , ${socket.id}`)

            // new message
            socket.on("event:message", async ({ message }: { message: string }) => {
                []
                console.log('New Message Rec.', message)
                await pub.publish('MESSAGES', JSON.stringify({ message }))  // publish this message on reddis , so that other server can get this message when they have subscribed it

            })

        })

        sub.on('message', (channel, message) => {
            if (channel === 'MESSAGES') {
                console.log('new message from redis ', message)
                io.emit('message', message);
            }
        })
    }
}

export default SocketService;

