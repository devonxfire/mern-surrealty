import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [agent, setAgent] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const res = await fetch(`/api/users/${listing.userRef}`);
        const data = await res.json();
        setAgent(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchAgent();
  }, [listing.userRef]);
  return (
    <div>
      {agent && (
        <div className="flex flex-col gap-2 border-t">
          <p className="my-4 text-slate-500 italic">
            Contact{" "}
            <span className="font-bold text-blue-950">{agent.username}</span>{" "}
            for{" "}
            <span className="font-bold text-blue-950">
              {listing.title.toLowerCase()}
            </span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="6"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Please type your message to the agent here..."
            className="w-full border p-3  text-slate-500 rounded-lg focus:outline-none text-sm"
          ></textarea>
          <div className="flex gap-4">
            <Link
              to={`mailto:${agent.email}?subject=Regarding ${listing.title}&body=${message}`}
              className=" w-[30%] "
            >
              <button className="uppercase w-full font-bold p-3 bg-red-600 hover:opacity-80 text-white self-center transition duration-300 ease-in-out transform hover:scale-105 mt-4 text-sm">
                Send message
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
