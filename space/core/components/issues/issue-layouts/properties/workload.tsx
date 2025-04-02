"use client";

import { Clock } from "lucide-react";
import { useTranslation } from "@plane/i18n";
// types
import { TIssuePriorities } from "@plane/types";
import {  Tooltip } from "@plane/ui";
// constants
import { cn, getIssueWorkloadFilters } from "@plane/utils";

export const IssueBlockWorkload = ({
  workload,
  shouldShowName = false,
}: {
  workload: TIssuePriorities | null;
  shouldShowName?: boolean;
}) => {
  // hooks
  const { t } = useTranslation();
  const workload_detail = workload != null ? getIssueWorkloadFilters(workload) : null;


  if (workload_detail === null) return <></>;

  return (
    <Tooltip tooltipHeading="Workload" tooltipContent={t(workload_detail?.titleTranslationKey || "")}>
      <div
        className={cn(
          "h-full flex items-center gap-1.5 border-[0.5px] rounded text-xs px-2 py-0.5",
        )}
      >
        <Clock className="size-3" />
        {shouldShowName && <span className="pl-2 text-sm">{t(workload_detail?.titleTranslationKey || "")}</span>}
      </div>
    </Tooltip>
  );
};
