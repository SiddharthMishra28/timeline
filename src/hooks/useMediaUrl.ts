"use client";

import { useEffect, useState } from "react";
import { Attachment } from "@/types";

export function useMediaUrl(attachment?: Attachment) {
  const [url, setUrl] = useState<string | undefined>(attachment?.previewUrl);

  useEffect(() => {
    if (!attachment || !attachment.blob) return;

    // Create a new URL for the blob
    const newUrl = URL.createObjectURL(attachment.blob);
    setUrl(newUrl);

    return () => {
      URL.revokeObjectURL(newUrl);
    };
  }, [attachment]);

  return url;
}
