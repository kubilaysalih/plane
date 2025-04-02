"use client";

import { Fragment, ReactNode, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { usePopper } from "react-popper";
import { Check, ChevronDown, Search, SignalHigh, Clock } from "lucide-react";
import { Combobox } from "@headlessui/react";
import { useTranslation } from "@plane/i18n";
// types
// ui
import { ComboDropDown,Tooltip } from "@plane/ui";
// helpers
import { cn } from "@/helpers/common.helper";
// hooks
import { useDropdown } from "@/hooks/use-dropdown";
import { usePlatformOS } from "@/hooks/use-platform-os";
// constants
import { BACKGROUND_BUTTON_VARIANTS, BORDER_BUTTON_VARIANTS, BUTTON_VARIANTS_WITHOUT_TEXT } from "./constants";
// types
import { TDropdownProps } from "./types";


export const ISSUE_WORKLOADS: {
  key: string;
  title: string;
}[] = [
  {
    key: "30m",
    title: "30 minutes",
  },
  {
    key: "1h",
    title: "1 hour",
  },
  {
    key: "2h",
    title: "2 hours",
  },
  {
    key: "3h",
    title: "3 hours",
  },
  {
    key: "4h",
    title: "4 hours",
  },
  {
    key: "6h",
    title: "6 hours",
  },
  {
    key: "8h",
    title: "8 hours",
  },
  {
    key: "1d",
    title: "1 day",
  },
  {
    key: "1.5d",
    title: "1.5 days",
  },
  {
    key: "2d",
    title: "2 days",
  },
  {
    key: "3d",
    title: "3 days",
  },
  {
    key: "4d",
    title: "4 days",
  },
  {
    key: "5d",
    title: "5 days",
  },
  {
    key: "1w",
    title: "1 week",
  },
  {
    key: "2w",
    title: "2 weeks",
  },
  {
    key: "3w",
    title: "3 weeks",
  },
  {
    key: "1m",
    title: "1 month",
  },
  {
    key: "1.5m",
    title: "1.5 months",
  },
  {
    key: "2m",
    title: "2 months",
  },
  {
    key: "3m",
    title: "3 months",
  },
  {
    key: "4m",
    title: "4 months",
  },
  {
    key: "5m",
    title: "5 months",
  },
  {
    key: "6m",
    title: "6 months",
  },
  {
    key: "9m",
    title: "9 months",
  },
  {
    key: "1y",
    title: "1 year",
  },
];


type Props = TDropdownProps & {
  button?: ReactNode;
  dropdownArrow?: boolean;
  dropdownArrowClassName?: string;
  highlightUrgent?: boolean;
  onChange: (val: any) => void;
  onClose?: () => void;
  value: any | undefined | null;
  renderByDefault?: boolean;
};

type ButtonProps = {
  className?: string;
  dropdownArrow: boolean;
  dropdownArrowClassName: string;
  hideIcon?: boolean;
  hideText?: boolean;
  isActive?: boolean;
  highlightUrgent: boolean;
  placeholder: string;
  workload: any | undefined;
  showTooltip: boolean;
  renderToolTipByDefault?: boolean;
};

const BorderButton = (props: ButtonProps) => {
  const {
    className,
    dropdownArrow,
    dropdownArrowClassName,
    hideIcon = false,
    hideText = false,
    placeholder,
    workload,
    showTooltip,
    renderToolTipByDefault = true,
  } = props;

  const workloadDetails = ISSUE_WORKLOADS.find((p) => p.key === workload);

  const { isMobile } = usePlatformOS();
  const { t } = useTranslation();

  return (
    <Tooltip
      tooltipHeading={t("workload")}
      tooltipContent={workloadDetails?.title ?? t("common.none")}
      disabled={!showTooltip}
      isMobile={isMobile}
      renderByDefault={renderToolTipByDefault}
    >
      <div
        className={cn(
          "h-full flex items-center gap-1.5 border-[0.5px] rounded text-xs px-2 py-0.5",
          className
        )}
      >
        {!hideIcon &&
          <Clock className="size-3" />}
        {dropdownArrow && (
          <ChevronDown className={cn("h-2.5 w-2.5 flex-shrink-0", dropdownArrowClassName)} aria-hidden="true" />
        )}
        {workloadDetails?.title}
      </div>
    </Tooltip>
  );
};

const BackgroundButton = (props: ButtonProps) => {
  const {
    className,
    dropdownArrow,
    dropdownArrowClassName,
    hideIcon = false,
    hideText = false,
    highlightUrgent,
    placeholder,
    workload,
    showTooltip,
    renderToolTipByDefault = true,
  } = props;

  const workloadDetails = ISSUE_WORKLOADS.find((p) => p.key === workload);

  const { isMobile } = usePlatformOS();
  const { t } = useTranslation();

  return (
    <Tooltip
      tooltipHeading={t("workload")}
      tooltipContent={t(workloadDetails?.key ?? "none")}
      disabled={!showTooltip}
      isMobile={isMobile}
      renderByDefault={renderToolTipByDefault}
    >
      <div
        className={cn(
          "h-full flex items-center gap-1.5 rounded text-xs px-2 py-0.5",
          {
            // compact the icons if text is hidden
            "px-0.5": hideText,
            // highlight the whole button if text is hidden and workload is urgent
          },
          className
        )}
      >
        <Clock
          workload={workload}
          size={12}
        />
        {dropdownArrow && (
          <ChevronDown className={cn("h-2.5 w-2.5 flex-shrink-0", dropdownArrowClassName)} aria-hidden="true" />
        )}
      </div>
    </Tooltip>
  );
};

const TransparentButton = (props: ButtonProps) => {
  const {
    className,
    dropdownArrow,
    dropdownArrowClassName,
    hideIcon = false,
    hideText = false,
    isActive = false,
    highlightUrgent,
    placeholder,
    workload,
    showTooltip,
    renderToolTipByDefault = true,
  } = props;

  const workloadDetails = ISSUE_WORKLOADS.find((p) => p.key === workload);


  const { isMobile } = usePlatformOS();
  const { t } = useTranslation();

  return (
    <Tooltip
      tooltipHeading={t("workload")}
      tooltipContent={workloadDetails?.title ?? t("common.none")}
      disabled={!showTooltip}
      isMobile={isMobile}
      renderByDefault={renderToolTipByDefault}
    >
      <div
        className={cn(
          "h-full w-full flex items-center gap-1.5 rounded text-xs px-2 py-0.5 hover:bg-custom-background-80",
          {
            // compact the icons if text is hidden
            "px-0.5": hideText,
            // highlight the whole button if text is hidden and workload is urgent
            "bg-custom-background-80": isActive,
          },
          className
        )}
      >
        {!hideIcon &&
          <Clock className="size-3" />}
        {!hideText && (
          <span className="flex-grow truncate">{workloadDetails?.title ?? t("common.workload") ?? placeholder}</span>
        )}
        {dropdownArrow && (
          <ChevronDown className={cn("h-2.5 w-2.5 flex-shrink-0", dropdownArrowClassName)} aria-hidden="true" />
        )}
      </div>
    </Tooltip>
  );
};

export const WorkloadDropdown: React.FC<Props> = (props) => {
  //hooks
  const { t } = useTranslation();
  const {
    button,
    buttonClassName,
    buttonContainerClassName,
    buttonVariant,
    className = "",
    disabled = false,
    dropdownArrow = false,
    dropdownArrowClassName = "",
    hideIcon = false,
    highlightUrgent = true,
    onChange,
    onClose,
    placeholder = t("common.workload"),
    placement,
    showTooltip = false,
    tabIndex,
    value = "none",
    renderByDefault = true,
  } = props;
  // states
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  // refs
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // popper-js refs
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  // popper-js init
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: placement ?? "bottom-start",
    modifiers: [
      {
        name: "preventOverflow",
        options: {
          padding: 12,
        },
      },
    ],
  });

  // next-themes
  // TODO: remove this after new theming implementation
  const { resolvedTheme } = useTheme();

  const options = ISSUE_WORKLOADS.map((workload) => ({
    value: workload.key,
    query: workload.key,
    content: (
      <div className="flex items-center gap-2">
        <Clock workload={workload.key} size={14} withContainer />
        <span className="flex-grow truncate">{workload.title}</span>
      </div>
    ),
  }));

  const filteredOptions =
    query === "" ? options : options.filter((o) => o.query.toLowerCase().includes(query.toLowerCase()));

  const dropdownOnChange = (val: any) => {
    onChange(val);
    handleClose();
  };

  const { handleClose, handleKeyDown, handleOnClick, searchInputKeyDown } = useDropdown({
    dropdownRef,
    inputRef,
    isOpen,
    onClose,
    query,
    setIsOpen,
    setQuery,
  });

  const ButtonToRender = BORDER_BUTTON_VARIANTS.includes(buttonVariant)
    ? BorderButton
    : BACKGROUND_BUTTON_VARIANTS.includes(buttonVariant)
      ? BackgroundButton
      : TransparentButton;

  const comboButton = (
    <>
      {button ? (
        <button
          ref={setReferenceElement}
          type="button"
          className={cn("clickable block h-full w-full outline-none", buttonContainerClassName)}
          onClick={handleOnClick}
          disabled={disabled}
          tabIndex={tabIndex}
        >
          {button}
        </button>
      ) : (
        <button
          ref={setReferenceElement}
          type="button"
          className={cn(
            "clickable block h-full max-w-full outline-none",
            {
              "cursor-not-allowed text-custom-text-200": disabled,
              "cursor-pointer": !disabled,
            },
            buttonContainerClassName
          )}
          onClick={handleOnClick}
          disabled={disabled}
          tabIndex={tabIndex}
        >
          <ButtonToRender
            workload={value ?? undefined}
            className={cn(buttonClassName, {
              "text-custom-text-200": resolvedTheme?.includes("dark") || resolvedTheme === "custom",
            })}
            highlightUrgent={highlightUrgent}
            dropdownArrow={dropdownArrow && !disabled}
            dropdownArrowClassName={dropdownArrowClassName}
            hideIcon={hideIcon}
            placeholder={placeholder}
            showTooltip={showTooltip}
            hideText={BUTTON_VARIANTS_WITHOUT_TEXT.includes(buttonVariant)}
            renderToolTipByDefault={renderByDefault}
          />
        </button>
      )}
    </>
  );

  return (
    <ComboDropDown
      as="div"
      ref={dropdownRef}
      className={cn(
        "h-full",
        {
          "bg-custom-background-80": isOpen,
        },
        className
      )}
      value={value}
      onChange={dropdownOnChange}
      disabled={disabled}
      onKeyDown={handleKeyDown}
      button={comboButton}
      renderByDefault={renderByDefault}
    >
      {isOpen && (
        <Combobox.Options className="fixed z-10" static>
          <div
            className="my-1 w-48 rounded border-[0.5px] border-custom-border-300 bg-custom-background-100 px-2 py-2.5 text-xs shadow-custom-shadow-rg focus:outline-none"
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
          >
            <div className="flex items-center gap-1.5 rounded border border-custom-border-100 bg-custom-background-90 px-2">
              <Search className="h-3.5 w-3.5 text-custom-text-400" strokeWidth={1.5} />
              <Combobox.Input
                as="input"
                ref={inputRef}
                className="w-full bg-transparent py-1 text-xs text-custom-text-200 placeholder:text-custom-text-400 focus:outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("search")}
                displayValue={(assigned: any) => assigned?.name}
                onKeyDown={searchInputKeyDown}
              />
            </div>
            <div className="mt-2 max-h-48 space-y-1 overflow-y-scroll">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <Combobox.Option
                    key={option.value}
                    value={option.value}
                    className={({ active, selected }) =>
                      `w-full truncate flex items-center justify-between gap-2 rounded px-1 py-1.5 cursor-pointer select-none ${
                        active ? "bg-custom-background-80" : ""
                      } ${selected ? "text-custom-text-100" : "text-custom-text-200"}`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className="flex-grow truncate">{option.content}</span>
                        {selected && <Check className="h-3.5 w-3.5 flex-shrink-0" />}
                      </>
                    )}
                  </Combobox.Option>
                ))
              ) : (
                <p className="text-custom-text-400 italic py-1 px-1.5">{t("no_matching_results")}</p>
              )}
            </div>
          </div>
        </Combobox.Options>
      )}
    </ComboDropDown>
  );
};
