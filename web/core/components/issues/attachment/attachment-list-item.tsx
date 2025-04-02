"use client";

import { FC, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { observer } from "mobx-react";
import { Trash } from "lucide-react";
import { EIssueServiceType } from "@plane/constants";
import { useTranslation } from "@plane/i18n";
import { TIssueServiceType } from "@plane/types";
// ui
import { CustomMenu, Tooltip } from "@plane/ui";
// components
import { ButtonAvatars } from "@/components/dropdowns/member/avatar";
import { getFileIcon } from "@/components/icons";
// helpers
import { convertBytesToSize, getFileExtension, getFileName } from "@/helpers/attachment.helper";
import { renderFormattedDate } from "@/helpers/date-time.helper";
import { getFileURL } from "@/helpers/file.helper";
// hooks
import { useIssueDetail, useMember } from "@/hooks/store";
import { usePlatformOS } from "@/hooks/use-platform-os";

type TIssueAttachmentsListItem = {
  attachmentId: string;
  disabled?: boolean;
  issueServiceType?: TIssueServiceType;
};

export const IssueAttachmentsListItem: FC<TIssueAttachmentsListItem> = observer((props) => {
  const { t } = useTranslation();
  // props
  const { attachmentId, disabled, issueServiceType = EIssueServiceType.ISSUES } = props;
  // store hooks
  const { getUserDetails } = useMember();
  const {
    attachment: { getAttachmentById },
    toggleDeleteAttachmentModal,
  } = useIssueDetail(issueServiceType);
  // derived values
  const attachment = attachmentId ? getAttachmentById(attachmentId) : undefined;
  const fileName = getFileName(attachment?.attributes.name ?? "");
  const fileExtension = getFileExtension(attachment?.asset_url ?? "");
  const fileIcon = getFileIcon(fileExtension, 18);
  const fileURL = getFileURL(attachment?.asset_url ?? "");
  // hooks
  const { isMobile } = usePlatformOS();

  // Check if the file is an image based on the MIME type
  const isImage = attachment?.attributes?.type?.startsWith('image/') || false;

  // State to store the signed URL
  const [signedImageUrl, setSignedImageUrl] = useState<string | null>(null);

  // Fetch the signed URL when the component mounts or when the attachment changes
  useEffect(() => {
    if (!attachment || !isImage) return;

    // Function to fetch the signed URL
    const fetchSignedUrl = async () => {
      try {
        // Make a request to the API to get the signed URL
        // Use the asset_url directly from the attachment object
        const response = await fetch(attachment.asset_url);

        // The response is a 302 redirect with a Location header containing the signed URL
        if (response.redirected) {
          // If the response was redirected, use the final URL
          setSignedImageUrl(response.url);
        } else if (response.headers && response.headers.get('Location')) {
          // If we can access the Location header directly
          setSignedImageUrl(response.headers.get('Location'));
        } else {
          console.error("Failed to get signed URL from response");
        }
      } catch (error) {
        console.error("Error fetching signed URL:", error);
      }
    };

    fetchSignedUrl();
  }, [attachment, isImage]);

  if (!attachment) return <></>;

  return (
    <>
      {isImage && signedImageUrl ? (
        <div className="mb-4">
          <div className="group flex items-center justify-between gap-3 h-11 hover:bg-custom-background-90 pl-9 pr-2">
            <div className="flex items-center gap-3 text-sm truncate">
              <div className="flex items-center gap-3">{fileIcon}</div>
              <Tooltip tooltipContent={`${fileName}.${fileExtension}`} isMobile={isMobile}>
                <p className="text-custom-text-200 font-medium truncate">{`${fileName}.${fileExtension}`}</p>
              </Tooltip>
              <span className="flex size-1.5 bg-custom-background-80 rounded-full" />
              <span className="flex-shrink-0 text-custom-text-400">{convertBytesToSize(attachment.attributes.size)}</span>
            </div>

            <div className="flex items-center gap-3">
              {attachment?.created_by && (
                <>
                  <Tooltip
                    isMobile={isMobile}
                    tooltipContent={`${
                      getUserDetails(attachment?.created_by)?.display_name ?? ""
                    } uploaded on ${renderFormattedDate(attachment.updated_at)}`}
                  >
                    <div className="flex items-center justify-center">
                      <ButtonAvatars showTooltip userIds={attachment?.created_by} />
                    </div>
                  </Tooltip>
                </>
              )}

              <CustomMenu ellipsis closeOnSelect placement="bottom-end" disabled={disabled}>
                <CustomMenu.MenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleDeleteAttachmentModal(attachmentId);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Trash className="h-3.5 w-3.5" strokeWidth={2} />
                    <span>{t("common.actions.delete")}</span>
                  </div>
                </CustomMenu.MenuItem>
              </CustomMenu>
            </div>
          </div>

          {/* Display the image */}
          <div className="mt-2 pl-9 pr-2">
            <img
              src={signedImageUrl}
              crossOrigin="use-credentials"
              alt={`${fileName}.${fileExtension}`}
              className="rounded-md max-h-48 w-auto"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(signedImageUrl, "_blank");
              }}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(fileURL, "_blank");
          }}
        >
          <div className="group flex items-center justify-between gap-3 h-11 hover:bg-custom-background-90 pl-9 pr-2">
          <div className="flex items-center gap-3 text-sm truncate">
            <div className="flex items-center gap-3">{fileIcon}</div>
            <Tooltip tooltipContent={`${fileName}.${fileExtension}`} isMobile={isMobile}>
              <p className="text-custom-text-200 font-medium truncate">{`${fileName}.${fileExtension}`}</p>
            </Tooltip>
            <span className="flex size-1.5 bg-custom-background-80 rounded-full" />
            <span className="flex-shrink-0 text-custom-text-400">{convertBytesToSize(attachment.attributes.size)}</span>
          </div>

          <div className="flex items-center gap-3">
            {attachment?.created_by && (
              <>
                <Tooltip
                  isMobile={isMobile}
                  tooltipContent={`${
                    getUserDetails(attachment?.created_by)?.display_name ?? ""
                  } uploaded on ${renderFormattedDate(attachment.updated_at)}`}
                >
                  <div className="flex items-center justify-center">
                    <ButtonAvatars showTooltip userIds={attachment?.created_by} />
                  </div>
                </Tooltip>
              </>
            )}

            <CustomMenu ellipsis closeOnSelect placement="bottom-end" disabled={disabled}>
              <CustomMenu.MenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleDeleteAttachmentModal(attachmentId);
                }}
              >
                <div className="flex items-center gap-2">
                  <Trash className="h-3.5 w-3.5" strokeWidth={2} />
                  <span>{t("common.actions.delete")}</span>
                </div>
              </CustomMenu.MenuItem>
            </CustomMenu>
          </div>
        </div>
      </button>
      )}
    </>
  );
});
