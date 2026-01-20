import { WebSocketServer, WebSocket } from "ws";

type Client = {
    socket: WebSocket;
    room: string;
};

const wss = new WebSocketServer({ port: 8080 });

let userCount = 0;
let clientStorage: Client[] = [];

wss.on("connection", (socket) => {
    userCount++;
    console.log(`user #${userCount} connected`);

    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message.toString());

        //join room
        if (parsedMessage.type === "join") {
            console.log(`user joined room: ${parsedMessage.payload.roomId}`);

            clientStorage.push({
                socket,
                room: parsedMessage.payload.roomId,
            });
        }

        // chat
        if (parsedMessage.type === "chat") {
            let currentUserRoom: string | null = null;

            for (let i = 0; i < clientStorage.length; i++) {
                //find current user's room
                //@ts-ignore
                if (clientStorage[i].socket === socket) {
                    //@ts-ignore
                    currentUserRoom = clientStorage[i].room;
                    break;
                }
            }

            if (!currentUserRoom) return;

            //message broadcast to the room
            for (let i = 0; i < clientStorage.length; i++) {
                //@ts-ignore
                if (clientStorage[i].room === currentUserRoom) {
                    //@ts-ignore
                    clientStorage[i].socket.send(
                        JSON.stringify({
                            type: "chat",
                            payload: {
                                message: parsedMessage.payload.message,
                            },
                        })
                    );
                }
            }
        }
    });

    socket.on("close", () => {
        clientStorage = clientStorage.filter(
            (client) => client.socket !== socket
        );
        userCount--;

        console.log(`user disconnected. current user count: ${userCount}`);
    });
});
