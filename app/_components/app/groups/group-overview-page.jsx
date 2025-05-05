import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const GroupOverviewPage = (props) => {
  const { groupUid } = props;

  const [pageLoading, setPageLoading] = useState(true);
  const [groupData, setGroupData] = useState([]);

  useEffect(() => {
    async function getGroupInfo() {
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
        const responseeData = await response.json();

        debugger;
        setGroupData(responseeData.data[0]);
      } catch {
        console.error("Error during fetch");
      } finally {
        setPageLoading(false);
      }
    }

    getGroupInfo()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader2 className="w-10 h-10 stroke-blackHaze-500 animate-spin" />
      </div>
    );
  }

  return <div>foobar</div>;
};

export default GroupOverviewPage;
