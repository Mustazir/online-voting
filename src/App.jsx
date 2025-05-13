import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [view, setView] = useState("signup");
  const [nid, setNid] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [results, setResults] = useState([]);
  const [candidateName, setCandidateName] = useState("");
  const [voteMessage, setVoteMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (view === "vote" || view === "results") {
      axios
        .get("http://localhost:5000/api/candidates")
        .then((res) => setCandidates(res.data))
        .catch((err) => console.error(err));
    }

    if (view === "results") {
      axios
        .get("http://localhost:5000/api/results")
        .then((res) => setResults(res.data))
        .catch((err) => console.error(err));
    }
  }, [view]);

  const handleSignUp = async () => {
    try {
      await axios.post("http://localhost:5000/api/register", {
        nid,
        username,
        password,
      });
      setVoteMessage("Signup successful");
      setView("login");
    } catch (error) {
      setVoteMessage("Signup failed");
    }
  };

  const handleLogin = async () => {
    try {
      if (nid === "admin" && password === "123456") {
        setIsAdmin(true);
        setView("vote");
        return;
      }

      await axios.post("http://localhost:5000/api/users/login", {
        nid,
        password,
      });
      setIsAdmin(false);
      setView("vote");
    } catch {
      setVoteMessage("Login failed");
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate) {
      setVoteMessage("Please select a candidate");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/vote", {
        nid,
        candidateId: selectedCandidate,
      });
      setVoteMessage("Vote submitted successfully");
    } catch {
      setVoteMessage("Failed to vote");
    }
  };

  const handleAddCandidate = async () => {
    if (!candidateName) {
      setVoteMessage("Enter candidate name");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/candidates", {
        name: candidateName,
      });
      setVoteMessage("Candidate added successfully");
      setCandidateName("");
    } catch {
      setVoteMessage("Error adding candidate");
    }
  };

  const handleSignOut = () => {
    setNid("");
    setUsername("");
    setPassword("");
    setCandidateName("");
    setVoteMessage("");
    setIsAdmin(false);
    setView("signup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col justify-center items-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        {view === "signup" && (
          <>
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
              Sign Up
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                NID
              </label>
              <input
                type="text"
                placeholder="Enter your NID"
                value={nid}
                onChange={(e) => setNid(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <button
              onClick={handleSignUp}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <button
                onClick={() => setView("login")}
                className="text-blue-600 hover:underline"
              >
                Login
              </button>
            </p>
          </>
        )}

        {view === "login" && (
          <>
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
              Login
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                NID or Admin Username
              </label>
              <input
                type="text"
                placeholder="Enter your NID"
                value={nid}
                onChange={(e) => setNid(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              New user?{" "}
              <button
                onClick={() => setView("signup")}
                className="text-blue-600 hover:underline"
              >
                Sign Up
              </button>
            </p>
          </>
        )}

        {view === "vote" && (
          <>
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
              Vote for a Candidate
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Select Candidate
              </label>
              <select
                value={selectedCandidate}
                onChange={(e) => setSelectedCandidate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="">Select Candidate</option>
                {candidates.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleVote}
              className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition"
            >
              Submit Vote
            </button>
            {isAdmin && (
              <>
                <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">
                  Add a Candidate
                </h3>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Enter candidate name"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>
                <button
                  onClick={handleAddCandidate}
                  className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
                >
                  Add Candidate
                </button>
              </>
            )}
            <button
              onClick={() => setView("results")}
              className="w-full bg-indigo-600 text-white py-3 mt-4 rounded-md hover:bg-indigo-700 transition"
            >
              View Results
            </button>
            <button
              onClick={handleSignOut}
              className="w-full bg-red-600 text-white py-3 mt-4 rounded-md hover:bg-red-700 transition"
            >
              Sign Out
            </button>
          </>
        )}

        {view === "results" && (
          <>
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
              Results
            </h2>
            <div className="mb-4">
              {results.length === 0 ? (
                <p className="text-gray-600">No votes yet.</p>
              ) : (
                results.map((candidate) => (
                  <div key={candidate._id} className="mb-2">
                    <p className="text-lg font-semibold">{candidate.name}</p>
                    <p className="text-gray-600">Votes: {candidate.votes}</p>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => setView("vote")}
              className="w-full bg-indigo-600 text-white py-3 mt-4 rounded-md hover:bg-indigo-700 transition"
            >
              Back to Voting
            </button>
            <button
              onClick={handleSignOut}
              className="w-full bg-red-600 text-white py-3 mt-4 rounded-md hover:bg-red-700 transition"
            >
              Sign Out
            </button>
          </>
        )}

        {voteMessage && (
          <div className="text-red-600 text-center mt-4">
            <p>{voteMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
