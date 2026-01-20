import { useEffect , useState } from "react";

function App() {
    const [messages, setMessages] = useState(["hi there" , "hi" , "hoooo"]);
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080/ws')
        ws.onmessage = (event) => {
            setMessages(m => [...m ,event.data])
        }
    }, []) //empty array : when mounted websocket connects
    return (
        <div className="bg-black h-screen flex flex-col">
            <br/> <br/> <br/>
            <div className="h-96/100 bg-black">
                {messages.map(message =><div className="mt-10"> <span className = "bg-white text-black rounded p-4 m-8">{message}</span> </div>)}
            </div>
            <div className="bg-white w-full flex flex-col">
                <input type="text" className="w-full p-4"></input>
                <button className="bg-purple-600 w-full">Send Message</button>
            </div>
        </div>
    )
}

export default App;