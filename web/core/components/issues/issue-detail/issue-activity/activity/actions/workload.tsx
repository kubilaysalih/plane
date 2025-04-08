import { FC } from "react";
import { observer } from "mobx-react";
import { Clock } from "lucide-react";
// hooks
import { useIssueDetail } from "@/hooks/store";
// components
import { IssueActivityBlockComponent, IssueLink } from "./";

type TIssueWorkloadActivity = { activityId: string; showIssue?: boolean; ends: "top" | "bottom" | undefined };

export const IssueWorkloadActivity: FC<TIssueWorkloadActivity> = observer((props) => {
  const { activityId, showIssue = true, ends } = props;
  // hooks
  const {
    activity: { getActivityById },
  } = useIssueDetail();

  const activity = getActivityById(activityId);

  if (!activity) return <></>;
  return (
    <IssueActivityBlockComponent
      icon={<Clock size={14} className="text-custom-text-200" aria-hidden="true" />}
      activityId={activityId}
      ends={ends}
    >
      <>
        {activity.new_value ? `set the workload to ` : `removed the workload `}
        {activity.new_value && (
          <>
            <span className="font-medium text-custom-text-100">{activity.new_value}</span>
          </>
        )}
        {showIssue && (activity.new_value ? ` for ` : ` from `)}

        {showIssue && <IssueLink activityId={activityId} />}.
      </>
    </IssueActivityBlockComponent>
  );
});
