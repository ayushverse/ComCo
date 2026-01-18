import {WebSocketServer ,WebSocket} from 'ws'

const wss = new WebSocketServer({port:8080})
let userCount = 0
let clientStorage : WebSocket[] = []

wss.on('connection' , (socket) => {

    clientStorage.push(socket)
    userCount++
    console.log(`user # ${userCount} connected`)

    socket.on('message' , (message) => {
        console.log(`received: ${message}`)

        for(let i =0;i<clientStorage.length;i++){
            const s = clientStorage[i];
            //@ts-ignore
            s.send(message.toString())
        }
    })

    socket.on('close' , () => {
        clientStorage = clientStorage.filter(s => s !== socket)
        userCount--
        console.log(`user disconnected. current user count: ${userCount}`)
    })
})