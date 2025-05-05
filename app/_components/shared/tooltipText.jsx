import {
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
  TooltipContent,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const TooltipText = ({ children, content, className, ...props }) => {
  return (
    <TooltipProvider className="z-50">
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        {content && content.length > 0 && (
          <TooltipContent
            {...props}
            className={cn("border-none bg-blackHaze-500 z-50", className)}
          >
            <span className="text-xs font-normal leading-[18px] text-nn-0">
              {content}
            </span>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipText;
