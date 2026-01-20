function App() {
    return (
        <div className="bg-black h-screen flex flex-col">
            <div className="h-96/100 bg-red-600"> </div>
            <div className="bg-white w-full flex flex-col">
                <input type="text" className="w-full p-4"></input>
                <button className="bg-purple-600 w-full">Send Message</button>
            </div>
        </div>
    )
}

export default App;