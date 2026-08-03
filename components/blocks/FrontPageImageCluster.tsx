"use client";

import { useRef } from "react";
import PreviewVideo from "./PreviewVideo";
import { useHoverCircle } from "@/components/animation/useHoverCircle";
import type { VideoSet } from "@/lib/video";

/**
 * "A call for the curious" cluster.
 *
 * Note this block does NOT use the theme's `frontanimation` scroll-zoom: that
 * trigger exists in theme.css but appears in zero pages of the mirror. The live
 * block is just slideup + the hover disc, so only those are ported.
 */

/**
 * The loop for THIS block — edit the paths here.
 *
 * Declared locally rather than imported from lib/video's TOP_CIRCLES because
 * ContactFooter uses that same set: changing it there would silently swap the
 * footer's loop too. Anything under public/ works, so `/video/my-clip.mp4` maps
 * to public/video/my-clip.mp4.
 *
 * Only `desktop.mp4` is required. `mobile` is served below 743px — point it at
 * the same file if you do not have a separate encode, or delete the key and the
 * desktop source is used everywhere. The optional webm/hevc entries are
 * alternates the browser picks between; drop them if you only have an mp4.
 *
 * The clip is 1920x640 (3:1), and the frame follows it — see the
 * `k-full-nocrop` rule in orbit.css, whose padding-bottom sets the aspect.
 * Swapping in a clip of a different ratio means updating that rule too, or the
 * new one gets cover-cropped.
 */
const CLUSTER_VIDEO: VideoSet = {
  desktop: {
    mp4: "/video/keep_section.mp4",
    webm: "/video/keep_section.webm",
    hevc: "/video/keep_section_hevc.mp4",
  },
  mobile: {
    mp4: "/video/keep_section_mob.mp4",
    webm: "/video/keep_section_mob.webm",
    hevc: "/video/keep_section_mob_hevc.mp4",
  },
};

export default function FrontPageImageCluster() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useHoverCircle(wrapperRef);

  return (
    <div className="wp-block-kenza-front-page-image-cluster" data-transition="slideup">
      <div className="sticky">
        <div className="wrapper" ref={wrapperRef} data-item="hover-circle">
          <div
            className="wp-block-kenza-cases-video undefined cover-nocrop"
            data-transition="slideup"
          >
            {/* data-video is a styling hook — see VideoLoopHeader. */}
            <div className="k-full-nocrop" data-video="">
              <div className="vcenter" />
              <PreviewVideo sources={CLUSTER_VIDEO} />
            </div>
          </div>

          <h3 className="wp-block-heading">
            Keep 
          </h3>

          <figure className="wp-block-image size-main-page-half-width third">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              decoding="async"
              width={1047}
              height={1254}
              loading="lazy"
              src="/media/2025/09/122.jpeg"
              alt="OrbitWorks engineer working on a software project"
              className="wp-image-150"
            />
          </figure>

          <h3 className="wp-block-heading">
            <em><em>Your Business </em>In </em> 
          </h3>
          <h3 className="wp-block-heading"> Orbit</h3>

          <figure className="wp-block-image size-main-page-third-width third">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              decoding="async"
              width={1254}
              height={1254}
              loading="lazy"
              src="/media/2025/09/133.jpeg"
              alt="OrbitWorks specialist reviewing AI analytics"
              className="wp-image-151"
            />
          </figure>
        </div>
      </div>
    </div>
  );
}
