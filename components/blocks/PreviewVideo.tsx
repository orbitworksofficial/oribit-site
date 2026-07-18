"use client";

import { useRef } from "react";
import { MIME, MOBILE_MEDIA, type VideoSet } from "@/lib/video";
import { useVideoPlay } from "@/components/animation/useVideoPlay";

/**
 * The looping `video.preview` the theme drops into every [data-video] block.
 *
 * theme.css keeps these at opacity:0 until `html.js-ready`, so the class name
 * and the loop/muted/playsinline set are all load-bearing. Playback is driven by
 * useVideoPlay rather than autoplay, matching data-scrolltrigger="videoplay".
 */
export default function PreviewVideo({
  sources,
  className = "preview",
  poster,
}: {
  sources: VideoSet;
  className?: string;
  poster?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useVideoPlay(ref);

  const { desktop, mobile } = sources;

  return (
    <video
      ref={ref}
      className={className}
      poster={poster ?? sources.poster}
      data-scrolltrigger="videoplay"
      loop
      muted
      playsInline
      preload="none"
      disablePictureInPicture
      // @ts-expect-error — non-standard but the theme sets it and Safari honours it
      disableRemotePlayback=""
    >
      {/* Mobile first: desktop browsers skip these on the media query. */}
      {mobile.mp4 && <source media={MOBILE_MEDIA} src={mobile.mp4} type={MIME.mp4} />}
      {mobile.webm && <source media={MOBILE_MEDIA} src={mobile.webm} type={MIME.webm} />}
      {mobile.hevc && <source media={MOBILE_MEDIA} src={mobile.hevc} type={MIME.hevc} />}

      {desktop.mp4 && <source src={desktop.mp4} type={MIME.mp4} />}
      {desktop.webm && <source src={desktop.webm} type={MIME.webm} />}
      {desktop.hevc && <source src={desktop.hevc} type={MIME.hevc} />}
    </video>
  );
}
