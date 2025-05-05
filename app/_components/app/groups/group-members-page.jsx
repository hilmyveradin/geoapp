import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const GroupMembersPage = ({ groupUid }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/groups/${groupUid}/members`);
        if (!response.ok) {
          throw new Error("Failed to fetch members");
        }
        const data = await response.json();
        setMembers(data);
      } catch (err) {
        console.error("Error fetching members:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [groupUid]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-2xl font-bold mb-4">Group Members</h2>
      {members.length === 0 ? (
        <p>No members found.</p>
      ) : (
        <ul>
          {members.map((member) => (
            <li key={member.id} className="mb-2">
              {member.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center w-full h-64">
    <Loader2 className="w-10 h-10 stroke-nileBlue-500 animate-spin" />
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="text-red-500 text-center p-4">{message}</div>
);

export default GroupMembersPage;
