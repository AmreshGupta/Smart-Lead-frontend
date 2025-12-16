import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [input, setInput] = useState("");
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState("All");

  const fetchLeads = async () => {
    const res = await axios.get(
      "https://smart-lead-backend-qnm1.onrender.com/api/leads"
    );
    setLeads(res.data);
  };

  const submitNames = async () => {
    if (!input.trim()) return;
    const names = input.split(",").map((n) => n.trim());
    await axios.post("https://smart-lead-backend-qnm1.onrender.com/api/leads", {
      names,
    });
    setInput("");
    await fetchLeads();
  };

  useEffect(() => {
    const loadLeads = async () => {
      try {
        await fetchLeads();
      } catch (err) {
        console.error(err);
      }
    };
    loadLeads();
  }, []);

  const filtered =
    filter === "All" ? leads : leads.filter((l) => l.status === filter);

  return (
    <div style={{ padding: 20 }}>
      <h2>Smart Lead Dashboard</h2>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Peter, Aditi, Ravi"
      />
      <button onClick={submitNames}>Submit</button>

      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option>All</option>
        <option>Verified</option>
        <option>To Check</option>
      </select>

      <table border="1" cellPadding="5" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Country</th>
            <th>Probability</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((l) => (
            <tr key={l._id}>
              <td>{l.name}</td>
              <td>{l.country}</td>
              <td>{l.probability}</td>
              <td>{l.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
