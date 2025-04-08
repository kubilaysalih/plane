import { useState } from "react";
// plane utils
import { Copy, ExternalLink } from "lucide-react";

import { TOAST_TYPE, setToast } from "@plane/ui";// hooks

import { cn } from "@plane/utils";

// components
import { ImageFullScreenAction } from "./full-screen";

type Props = {
  containerClassName?: string;
  image: {
    src: string;
    height: string;
    width: string;
    aspectRatio: number;
  };
};

export const ImageToolbarRoot: React.FC<Props> = (props) => {
  const { containerClassName, image } = props;
  // state
  const [isFullScreenEnabled, setIsFullScreenEnabled] = useState(false);

  return (
    <>
      <div
        className={cn(containerClassName, {
          "opacity-100 pointer-events-auto": isFullScreenEnabled,
        })}
      >
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            try {
              navigator.clipboard.writeText(image.src as string)
              setToast({
                type: TOAST_TYPE.SUCCESS,
                title: "Successfully copied to clipboard!",
                message: "Yey 🥳🥳🥳",
              })
            } catch (error) {
              //
            }
          }}
          className="size-5 grid place-items-center hover:bg-black/40 text-white rounded transition-colors"
        >
          <Copy className="size-3" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(image.src as string, '_blank');
          }}
          className="size-5 grid place-items-center hover:bg-black/40 text-white rounded transition-colors"
        >
          <ExternalLink className="size-3" />
        </button>
        <ImageFullScreenAction
          image={image}
          isOpen={isFullScreenEnabled}
          toggleFullScreenMode={(val) => setIsFullScreenEnabled(val)}
        />
      </div>
    </>
  );
};
