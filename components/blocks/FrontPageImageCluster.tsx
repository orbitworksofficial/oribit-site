"use client";

import { useRef } from "react";
import PreviewVideo from "./PreviewVideo";
import { useHoverCircle } from "@/components/animation/useHoverCircle";
import { TOP_CIRCLES } from "@/lib/video";

/**
 * "A call for the curious" cluster.
 *
 * Note this block does NOT use the theme's `frontanimation` scroll-zoom: that
 * trigger exists in theme.css but appears in zero pages of the mirror. The live
 * block is just slideup + the hover disc, so only those are ported.
 */
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
              <PreviewVideo sources={TOP_CIRCLES} />
            </div>
          </div>

          <h3 className="wp-block-heading">
            A call <em>for</em>
          </h3>

          <figure className="wp-block-image size-main-page-half-width third">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              decoding="async"
              width={1203}
              height={800}
              loading="lazy"
              src="/media/2024/05/11.jpg"
              alt=""
              className="wp-image-150"
            />
          </figure>

          <h3 className="wp-block-heading">
            <em>for</em> the
          </h3>
          <h3 className="wp-block-heading">curious</h3>

          <figure className="wp-block-image size-main-page-third-width third">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              decoding="async"
              width={948}
              height={533}
              loading="lazy"
              src="/media/2024/05/22.jpg"
              alt=""
              className="wp-image-151"
            />
          </figure>
        </div>
      </div>
    </div>
  );
}
