"use client";

import { useRef, useState } from "react";

/**
 * Featured image picker.
 *
 * Uploads from the device — file browser on a laptop, camera roll on a phone —
 * and keeps the resulting path in a hidden input so the form and its Server
 * Action are unchanged.
 *
 * The path stays visible and editable underneath: posts seeded before uploads
 * existed reference files checked into public/, and there is no reason to make
 * those uneditable just because new ones arrive by upload.
 */

export type Props = {
  name: string;
  defaultValue: string;
  altName: string;
  altDefault: string;
};

export default function ImageField({ name, defaultValue, altName, altDefault }: Props) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Upload failed.");
        return;
      }
      setUrl(data.url);
    } catch {
      setError("Upload failed. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="adm-img">
      <input type="hidden" name={name} value={url} />

      <div
        className={`adm-img__drop${dragging ? " is-over" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files?.[0];
          if (f) upload(f);
        }}
      >
        {url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="adm-img__preview" />
            <div className="adm-img__over">
              <button
                type="button"
                className="adm-btn adm-btn--ghost adm-btn--sm"
                onClick={() => input.current?.click()}
                disabled={busy}
              >
                Replace
              </button>
              <button
                type="button"
                className="adm-btn adm-btn--ghost adm-btn--sm"
                onClick={() => setUrl("")}
                disabled={busy}
              >
                Remove
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            className="adm-img__empty"
            onClick={() => input.current?.click()}
            disabled={busy}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
            <strong>{busy ? "Uploading…" : "Choose an image"}</strong>
            <span>Drag one here, or take a photo on your phone</span>
          </button>
        )}

        {busy && url && <div className="adm-img__busy">Uploading…</div>}
      </div>

      {/*
        `accept` filters the OS file browser and, on iOS and Android, offers the
        camera alongside the photo library.
      */}
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          // Reset so choosing the same file twice still fires a change event.
          e.target.value = "";
        }}
      />

      {error && <div className="adm-error">{error}</div>}

      <label className="adm-field" style={{ marginTop: 12 }}>
        <span>Alt text</span>
        <input
          className="adm-input"
          name={altName}
          defaultValue={altDefault}
          placeholder="Describe the image for screen readers"
        />
      </label>

      <label className="adm-field" style={{ marginTop: 10 }}>
        <span className="adm-img__pathlabel">Path</span>
        <input
          className="adm-input adm-input--sm"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Uploaded automatically, or paste a URL"
        />
        <span className="adm-hint">
          Filled in when you upload. Accepts a full URL or a path under /public.
        </span>
      </label>
    </div>
  );
}
