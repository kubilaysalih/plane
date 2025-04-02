import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import packageJson from "package.json";
import { useTranslation } from "@plane/i18n";
// ui
import { Tooltip, TOAST_TYPE, setToast } from "@plane/ui";// hooks
import { usePlatformOS } from "@/hooks/use-platform-os";
// assets
import {  useUser } from "@/hooks/store";
// local components
import { PaidPlanUpgradeModal } from "./upgrade";

export const WorkspaceEditionBadge = observer(() => {
  const { isMobile } = usePlatformOS();
  const { t } = useTranslation();
  // states
  const { data: currentUser } = useUser();
  const [isPaidPlanPurchaseModalOpen, setIsPaidPlanPurchaseModalOpen] = useState(false);

  useEffect(() => {
    if(!currentUser.avatar) {
      setToast({
        type: TOAST_TYPE.ERROR,
        title: "Please upload avatar!",
        message: "cuz avatars are so cute 😁",
      })
    }
  }, [currentUser.avatar])

  return (
    <>
      <Tooltip tooltipContent={`Version: v${packageJson.version}`} isMobile={isMobile}>
        <div className="w-full cursor-default rounded-md bg-pink-500/10 px-2 py-1 text-center text-xs font-medium text-gray-500 outline-none leading-6">
          Community
        </div>
      </Tooltip>
    </>
  );
});
