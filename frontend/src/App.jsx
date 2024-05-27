import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

function App() {
  const [inputData, setInputData] = useState("");
  const [groupInput, setGroupInput] = useState("");
  const [messages, setAllMessages] = useState([]);
  const [roomId, setRoomId] = useState("");

  const socket = useMemo(() => io("http://localhost:3000"), []);

  const sendData = (event) => {
    event.preventDefault();
    socket.emit("user_message", inputData);
    socket.emit("group_message", { message: groupInput, group: roomId });
    setInputData("");
    setGroupInput("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      // console.log("frontend user connected id is", socket.id);
      setRoomId(socket.id);
    });

    socket.on("user-receive-message", (response) => {
      console.log(response);
      setAllMessages((prevMessage) => [...prevMessage, response]);
    });

    socket.on("group-receive-message", (response) => {
      console.log(response);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="w-full h-[100vh] flex items-center justify-center flex-col">
      <form
        onSubmit={sendData}
        className="w-[500px] h-[300px] p-3 shadow-lg rounded-lg bg-white flex items-center justify-center flex-col gap-3"
      >
        <h1 className="mb-2 text-2xl font-bold text-black">{roomId}</h1>
        <input
          type="text"
          placeholder="Type here"
          className="w-full text-white shadow-lg bg-slate-500 placeholder:text-white input focus:outline-none focus:shadow-lg"
          value={inputData}
          onChange={(event) => setInputData(event.target.value)}
        />
        <input
          type="text"
          placeholder="Group message"
          className="w-full text-white shadow-lg bg-slate-500 placeholder:text-white input focus:outline-none focus:shadow-lg"
          value={groupInput}
          onChange={(event) => setGroupInput(event.target.value)}
        />
        <button
          type="submit"
          className="w-full text-sm text-white btn btn-success"
        >
          Send Message
        </button>
      </form>
      <h2 className="">Chats</h2>
      <ul className="mt-4 list-none">
        {messages?.map((element, index) => {
          return <li key={index}>{element}</li>;
        })}
      </ul>
    </div>
  );
}

export default App;
