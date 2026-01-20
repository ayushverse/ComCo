import { useEffect, useState, useRef } from "react";

function App() {
    const [messages, setMessages] = useState(["hi there", "hi", "hoooo"]); // initial messages
    const [input, setInput] = useState("");
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080/ws"); // connect to server

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "chat") {
                setMessages((m) => [...m, data.payload.message]); // eg- hi there , hi , hoooo , new message
            }
        };

        wsRef.current = ws;

        ws.onopen = () => {
            ws.send(
                JSON.stringify({
                    type: "join",
                    payload: {
                        roomId: "room1",
                    },
                })
            );
        };

        return () => {
            ws.close();
        };
    }, []); // receive messages , empty array : when mounted websocket connects

    return (
        <div className="bg-black h-screen flex flex-col">
            <br /> <br /> <br />
            <div className="h-96/100 bg-black">
                {messages.map((message, idx) => (
                    <div key={idx} className="mt-10">
            <span className="bg-white text-black rounded p-4 m-8">
              {message}
            </span>
                    </div>
                ))}
            </div>

            <div className="bg-white w-full flex flex-col">
                <input
                    id="message"
                    type="text"
                    className="w-full p-4"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />

                <button
                    className="bg-purple-600 w-full"
                    onClick={() => {
                        if (!input.trim()) return;

                        wsRef.current?.send(
                            JSON.stringify({
                                type: "chat",
                                payload: {
                                    message: input.toString(),
                                },
                            })
                        );

                        setInput("");
                    }}
                >
                    Send Message
                </button>
            </div>
        </div>
    );
}

export default App;
