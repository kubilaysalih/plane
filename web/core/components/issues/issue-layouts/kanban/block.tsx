"use client";

import { MutableRefObject, useEffect, useRef, useState } from "react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { observer } from "mobx-react";
import { useParams } from "next/navigation";
// plane helpers
import { EIssueServiceType } from "@plane/constants";
import { useOutsideClickDetector } from "@plane/hooks";
// types
import { TIssue, IIssueDisplayProperties, IIssueMap } from "@plane/types";
// ui
import { ControlLink, DropIndicator, TOAST_TYPE, Tooltip, setToast } from "@plane/ui";
// components
import RenderIfVisible from "@/components/core/render-if-visible-HOC";
import { HIGHLIGHT_CLASS } from "@/components/issues/issue-layouts/utils";
// helpers
import { cn } from "@/helpers/common.helper";
import { generateWorkItemLink } from "@/helpers/issue.helper";
// hooks
import { useIssueDetail, useKanbanView, useProject } from "@/hooks/store";
import useIssuePeekOverviewRedirection from "@/hooks/use-issue-peek-overview-redirection";
import { usePlatformOS } from "@/hooks/use-platform-os";
// plane web components
import { IssueIdentifier } from "@/plane-web/components/issues";
// local components
import { IssueStats } from "@/plane-web/components/issues/issue-layouts/issue-stats";
import { TRenderQuickActions } from "../list/list-view-types";
import { IssueProperties } from "../properties/all-properties";
import { WithDisplayPropertiesHOC } from "../properties/with-display-properties-HOC";
import { getIssueBlockId } from "../utils";

interface IssueBlockProps {
  issueId: string;
  groupId: string;
  subGroupId: string;
  issuesMap: IIssueMap;
  displayProperties: IIssueDisplayProperties | undefined;
  draggableId: string;
  canDropOverIssue: boolean;
  canDragIssuesInCurrentGrouping: boolean;
  updateIssue: ((projectId: string | null, issueId: string, data: Partial<TIssue>) => Promise<void>) | undefined;
  quickActions: TRenderQuickActions;
  canEditProperties: (projectId: string | undefined) => boolean;
  scrollableContainerRef?: MutableRefObject<HTMLDivElement | null>;
  shouldRenderByDefault?: boolean;
  isEpic?: boolean;
}

interface IssueDetailsBlockProps {
  cardRef: React.RefObject<HTMLElement>;
  issue: TIssue;
  displayProperties: IIssueDisplayProperties | undefined;
  updateIssue: ((projectId: string | null, issueId: string, data: Partial<TIssue>) => Promise<void>) | undefined;
  quickActions: TRenderQuickActions;
  isReadOnly: boolean;
  isEpic?: boolean;
}

const KanbanIssueDetailsBlock: React.FC<IssueDetailsBlockProps> = observer((props) => {
  const { cardRef, issue, updateIssue, quickActions, isReadOnly, displayProperties, isEpic = false } = props;
  // hooks
  const { isMobile } = usePlatformOS();

  // derived values
  const subIssueCount = issue?.sub_issues_count ?? 0;

  const handleEventPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };


  // Extract image path and asset URL from description HTML
  // Match both custom <image-component> tags and standard <img> tags
  const imageComponentMatch = issue.description_html?.match(/<image-component[^>]*src="([^"]*)"[^>]*>/);
  const imgTagMatch = issue.description_html?.match(/<img[^>]+src="([^">]+)"/);
  const imagePath = (imageComponentMatch || imgTagMatch || [])?.[1];

  // Check if the image path is a full URL
  const isFullUrl = imagePath?.startsWith('http://') || imagePath?.startsWith('https://');

  // Get the workspace slug from the router params
  const { workspaceSlug } = useParams();

  // If it's a full URL, use it directly, otherwise construct the asset URL
  const assetUrl = imagePath
    ? isFullUrl
      ? imagePath
      : `/api/assets/v2/workspaces/${workspaceSlug}/projects/${issue.project_id}/${imagePath}/`
    : null;

  // Extract Spotify and YouTube links from description
  const spotifyMatch = issue.description_html?.match(/https:\/\/open\.spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/);
  const spotifyEmbed = spotifyMatch ? {
    type: spotifyMatch[1],
    id: spotifyMatch[2],
    url: `https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}`
  } : null;

  const youtubeMatch = issue.description_html?.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  const youtubeEmbed = youtubeMatch ? {
    id: youtubeMatch[1],
    url: `https://www.youtube.com/embed/${youtubeMatch[1]}`
  } : null;

  // State to store the signed URL
  const [signedImageUrl, setSignedImageUrl] = useState<string | null>(null);

  // Fetch the signed URL when the component mounts or when assetUrl changes
  useEffect(() => {
    // Ensure this code only runs in the browser
    if (typeof window === 'undefined' || !assetUrl) return;

    let isMounted = true;

    // Function to fix malformed URLs that have two URLs concatenated
    const fixMalformedUrl = (url: string) => {
      // Check if the URL contains two http/https protocols
      if (url.indexOf('http', 10) !== -1) {
        // Find the second occurrence of http or https
        const secondHttpIndex = url.indexOf('http', 10);
        // Return only the part after the second http
        return url.substring(secondHttpIndex);
      }
      return url;
    };

    // Function to fetch the signed URL
    const fetchSignedUrl = async () => {
      try {
        // If it's already a full URL, we might not need to fetch a signed URL
        if (isFullUrl) {
          setSignedImageUrl(fixMalformedUrl(assetUrl));
          return;
        }

        // Make a request to the API to get the signed URL
        const response = await fetch(assetUrl, {
          credentials: 'include', // Include cookies for authentication
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });

        // Only update state if component is still mounted
        if (!isMounted) return;

        // The response is a 302 redirect with a Location header containing the signed URL
        if (response.redirected) {
          // If the response was redirected, use the final URL
          const redirectUrl = fixMalformedUrl(response.url);
          setSignedImageUrl(redirectUrl);
        } else if (response.headers && response.headers.get('Location')) {
          // If we can access the Location header directly
          const locationUrl = fixMalformedUrl(response.headers.get('Location') || '');
          setSignedImageUrl(locationUrl);
        } else if (response.ok) {
          // If the response is OK but not redirected, try to use the URL directly
          setSignedImageUrl(assetUrl);
        } else {
          console.error("Failed to get signed URL from response");
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching signed URL:", error);
        }
      }
    };

    fetchSignedUrl();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [assetUrl, isFullUrl]);

  return (
    <>
      <div className="relative">
        {issue.project_id && (
          <IssueIdentifier
            issueId={issue.id}
            projectId={issue.project_id}
            textContainerClassName="line-clamp-1 text-xs text-custom-text-300"
            displayProperties={displayProperties}
          />
        )}
        <div
          className={cn("absolute -top-1 right-0", {
            "hidden group-hover/kanban-block:block": !isMobile,
          })}
          onClick={handleEventPropagation}
        >
          {quickActions({
            issue,
            parentRef: cardRef,
          })}
        </div>
      </div>

      <Tooltip tooltipContent={issue.name} isMobile={isMobile} renderByDefault={false}>
        <div className="w-full line-clamp-1 text-sm text-custom-text-300 font-medium">
          <span>{issue.name}</span>
        </div>
      </Tooltip>

      {signedImageUrl && (
        <div className="mt-2 mb-2">
          <img
            src={signedImageUrl}
            crossOrigin="use-credentials"
            alt="Issue attachment"
            className="w-full h-auto max-h-[300px] object-contain"
            />
        </div>
      )}

      {spotifyEmbed && (
        <div className="mt-3 mb-3 rounded-md overflow-hidden shadow-sm border border-custom-border-200">
          <iframe
            src={spotifyEmbed.url}
            width="100%"
            height="80"
            frameBorder="0"
            allow="encrypted-media"
            title={`Spotify ${spotifyEmbed.type}`}
            className="bg-custom-background-80"
          ></iframe>
        </div>
      )}

      {youtubeEmbed && (
        <div className="mt-3 mb-3 rounded-md overflow-hidden shadow-sm border border-custom-border-200 aspect-video">
          <iframe
            src={youtubeEmbed.url}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video"
            className="bg-custom-background-80"
          ></iframe>
        </div>
      )}


      <IssueProperties
        className="flex flex-wrap items-center gap-2 whitespace-nowrap text-custom-text-300 pt-1.5"
        issue={issue}
        displayProperties={displayProperties}
        activeLayout="Kanban"
        updateIssue={updateIssue}
        isReadOnly={isReadOnly}
        isEpic={isEpic}
      />

      {isEpic && displayProperties && (
        <WithDisplayPropertiesHOC
          displayProperties={displayProperties}
          displayPropertyKey="sub_issue_count"
          shouldRenderProperty={(properties) => !!properties.sub_issue_count && !!subIssueCount}
        >
          <IssueStats issueId={issue.id} className="mt-2 font-medium text-custom-text-350" />
        </WithDisplayPropertiesHOC>
      )}
    </>
  );
});

export const KanbanIssueBlock: React.FC<IssueBlockProps> = observer((props) => {
  const {
    issueId,
    groupId,
    subGroupId,
    issuesMap,
    displayProperties,
    canDropOverIssue,
    canDragIssuesInCurrentGrouping,
    updateIssue,
    quickActions,
    canEditProperties,
    scrollableContainerRef,
    shouldRenderByDefault,
    isEpic = false,
  } = props;

  const cardRef = useRef<HTMLAnchorElement | null>(null);
  // router
  const { workspaceSlug: routerWorkspaceSlug } = useParams();
  const workspaceSlug = routerWorkspaceSlug?.toString();
  // hooks
  const { getProjectIdentifierById } = useProject();
  const { getIsIssuePeeked } = useIssueDetail(isEpic ? EIssueServiceType.EPICS : EIssueServiceType.ISSUES);
  const { handleRedirection } = useIssuePeekOverviewRedirection(isEpic);
  const { isMobile } = usePlatformOS();

  // handlers
  const handleIssuePeekOverview = (issue: TIssue) => handleRedirection(workspaceSlug, issue, isMobile);

  const issue = issuesMap[issueId];

  const { setIsDragging: setIsKanbanDragging } = useKanbanView();

  const [isDraggingOverBlock, setIsDraggingOverBlock] = useState(false);
  const [isCurrentBlockDragging, setIsCurrentBlockDragging] = useState(false);

  const canEditIssueProperties = canEditProperties(issue?.project_id ?? undefined);

  const isDragAllowed = canDragIssuesInCurrentGrouping && !issue?.tempId && canEditIssueProperties;
  const projectIdentifier = getProjectIdentifierById(issue?.project_id);

  const workItemLink = generateWorkItemLink({
    workspaceSlug,
    projectId: issue?.project_id,
    issueId,
    projectIdentifier,
    sequenceId: issue?.sequence_id,
    isEpic,
    isArchived: !!issue?.archived_at,
  });

  useOutsideClickDetector(cardRef, () => {
    cardRef?.current?.classList?.remove(HIGHLIGHT_CLASS);
  });

  // Make Issue block both as as Draggable and,
  // as a DropTarget for other issues being dragged to get the location of drop
  useEffect(() => {
    const element = cardRef.current;

    if (!element) return;

    return combine(
      draggable({
        element,
        dragHandle: element,
        canDrag: () => isDragAllowed,
        getInitialData: () => ({ id: issue?.id, type: "ISSUE" }),
        onDragStart: () => {
          setIsCurrentBlockDragging(true);
          setIsKanbanDragging(true);
        },
        onDrop: () => {
          setIsKanbanDragging(false);
          setIsCurrentBlockDragging(false);
        },
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) => source?.data?.id !== issue?.id && canDropOverIssue,
        getData: () => ({ id: issue?.id, type: "ISSUE" }),
        onDragEnter: () => {
          setIsDraggingOverBlock(true);
        },
        onDragLeave: () => {
          setIsDraggingOverBlock(false);
        },
        onDrop: () => {
          setIsDraggingOverBlock(false);
        },
      })
    );
  }, [cardRef?.current, issue?.id, isDragAllowed, canDropOverIssue, setIsCurrentBlockDragging, setIsDraggingOverBlock]);

  if (!issue) return null;

  return (
    <>
      <DropIndicator isVisible={!isCurrentBlockDragging && isDraggingOverBlock} />
      <div
        id={`issue-${issueId}`}
        // make Z-index higher at the beginning of drag, to have a issue drag image of issue block without any overlaps
        className={cn("group/kanban-block relative mb-2", { "z-[1]": isCurrentBlockDragging })}
        onDragStart={() => {
          if (isDragAllowed) setIsCurrentBlockDragging(true);
          else {
            setToast({
              type: TOAST_TYPE.WARNING,
              title: "Cannot move work item",
              message: !canEditIssueProperties
                ? "You are not allowed to move this work item"
                : "Drag and drop is disabled for the current grouping",
            });
          }
        }}
      >
        <ControlLink
          id={getIssueBlockId(issueId, groupId, subGroupId)}
          href={workItemLink}
          ref={cardRef}
          className={cn(
            "block rounded border-[1px] outline-[0.5px] outline-transparent w-full border-custom-border-200 bg-custom-background-100 text-sm transition-all hover:border-custom-border-400",
            { "hover:cursor-pointer": isDragAllowed },
            { "border border-custom-primary-70 hover:border-custom-primary-70": getIsIssuePeeked(issue.id) },
            { "bg-custom-background-80 z-[100]": isCurrentBlockDragging }
          )}
          onClick={() => handleIssuePeekOverview(issue)}
          disabled={!!issue?.tempId}
        >
          <RenderIfVisible
            classNames="space-y-2 px-3 py-2"
            root={scrollableContainerRef}
            defaultHeight="100px"
            horizontalOffset={100}
            verticalOffset={200}
            defaultValue={shouldRenderByDefault}
          >
            <KanbanIssueDetailsBlock
              cardRef={cardRef}
              issue={issue}
              displayProperties={displayProperties}
              updateIssue={updateIssue}
              quickActions={quickActions}
              isReadOnly={!canEditIssueProperties}
              isEpic={isEpic}
            />
          </RenderIfVisible>
        </ControlLink>
      </div>
    </>
  );
});

KanbanIssueBlock.displayName = "KanbanIssueBlock";
