
import { ReactNode, useEffect } from "react";

import { observer } from "mobx-react";
// ui
import { Tooltip, TOAST_TYPE, setToast } from "@plane/ui";

import {  useUser } from "@/hooks/store";
// hooks
import { usePlatformOS } from "@/hooks/use-platform-os";
// assets
import packageJson from "package.json";

export const WorkspaceEditionBadge = observer(() => {
  const { isMobile } = usePlatformOS();
  const { data: currentUser } = useUser();

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
    <Tooltip tooltipContent={`Version: v${packageJson.version}`} isMobile={isMobile}>
      <div className="w-full cursor-default rounded-md bg-pink-500/10 px-2 py-1 text-center text-xs font-medium text-gray-500 outline-none leading-6">
        Community
      </div>
    </Tooltip>
  );
});
