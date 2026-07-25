"use client";

import NextLink from "next/link";
import { ComponentProps, forwardRef } from "react";
import { useLoader } from "@/components/providers/LoaderProvider";
import { useRouter } from "next/navigation";

type LinkProps = ComponentProps<typeof NextLink>;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { onClick, ...props },
  ref
) {
  const { startLoading } = useLoader();

  return (
    <NextLink
      {...props}
      ref={ref}
      onClick={(e) => {
        // Only trigger loading for standard left clicks without modifiers
        if (
          !e.defaultPrevented &&
          e.button === 0 &&
          !e.metaKey &&
          !e.ctrlKey &&
          !e.altKey &&
          !e.shiftKey &&
          props.href
        ) {
          // Check if it's an internal link
          const isInternal =
            typeof props.href === "string" &&
            (props.href.startsWith("/") || props.href.startsWith("#"));
          
          if (isInternal) {
            startLoading();
          }
        }
        if (onClick) {
          onClick(e);
        }
      }}
    />
  );
});
