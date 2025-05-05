import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const GroupOverviewPage = ({ groupUid }) => {
  const [loading, setLoading] = useState(true);
  const [groupData, setGroupData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getGroupInfo = async () => {
      try {
        const response = await fetch(
          `/api/groups/get-group-info?groupUid=${groupUid}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch group info");
        }
        const responseData = await response.json();
        setGroupData(responseData.data[0]);
      } catch (err) {
        console.error("Error during fetch:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getGroupInfo();
  }, [groupUid]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!groupData) {
    return <ErrorMessage message="No group data available" />;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-2xl font-bold mb-4">{groupData.groupName}</h2>
      {/* Add more group data here */}
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

export default GroupOverviewPage;
