"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Local draft autosave, in the Gmail sense.
 *
 * Not to be confused with the post's `status: "draft"`, which is a deliberate
 * database save. This keeps whatever is currently typed in localStorage so a
 * reload, a crashed tab, or a closed browser does not lose the work. Nothing
 * here touches the server.
 *
 * localStorage rather than the database on purpose: an unsaved draft is the
 * author's private working state, not content. Writing every keystroke to Mongo
 * would mean a half-written post could be picked up by another editor, and a
 * failed network call would be one more thing to explain.
 *
 * Keyed per post — `new` for a fresh post, the post id when editing — so two
 * tabs on different posts never overwrite one another.
 */

/** Fields never worth restoring: identity, or reconstructed on load. */
const SKIP = new Set(["id", "$ACTION_ID", "$ACTION_REF", "$ACTION_KEY"]);

export type DraftState = {
  /** A draft exists for this post and differs from what was loaded. */
  found: boolean;
  /** When it was written. */
  savedAt: Date | null;
};

function keyFor(postId: string | undefined) {
  return `orbit:blog-draft:${postId ?? "new"}`;
}

/** Serialise a form to a plain object, skipping React's action plumbing. */
function readForm(form: HTMLFormElement): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {};
  const fd = new FormData(form);
  for (const [name, value] of fd.entries()) {
    if (typeof value !== "string") continue;
    // React Server Action fields are prefixed with $ and change every render.
    if (name.startsWith("$") || SKIP.has(name)) continue;

    if (name in out) {
      // Multi-value fields (tag checkboxes) collect into an array.
      const prev = out[name];
      out[name] = Array.isArray(prev) ? [...prev, value] : [prev as string, value];
    } else {
      out[name] = value;
    }
  }
  return out;
}

export function useFormDraft(
  formRef: React.RefObject<HTMLFormElement | null>,
  postId: string | undefined,
) {
  const key = keyFor(postId);
  const [draft, setDraft] = useState<DraftState>({ found: false, savedAt: null });
  const [savedTick, setSavedTick] = useState<Date | null>(null);
  /** Set once the post saves, so the unload handler stops warning. */
  const submitted = useRef(false);

  /** Write the current form to localStorage. */
  const save = useCallback(() => {
    const form = formRef.current;
    if (!form || submitted.current) return;
    try {
      const data = readForm(form);
      // A form the author has not touched is not worth a draft.
      const hasContent = Boolean(
        (data.title as string)?.trim() ||
          (data.excerpt as string)?.trim() ||
          (data.content as string)?.replace(/<[^>]*>/g, "").trim(),
      );
      if (!hasContent) return;

      const at = new Date();
      localStorage.setItem(key, JSON.stringify({ at: at.toISOString(), data }));
      setSavedTick(at);
    } catch {
      // Quota exceeded or storage disabled — autosave is a convenience, never
      // a reason to interrupt writing.
    }
  }, [formRef, key]);

  /** Look for an existing draft on mount. */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { at: string; data: Record<string, unknown> };
      if (parsed?.data) setDraft({ found: true, savedAt: new Date(parsed.at) });
    } catch {
      /* corrupt entry — ignored, and overwritten on the next save */
    }
  }, [key]);

  /**
   * Autosave on a timer rather than on every keystroke: writing to localStorage
   * is synchronous and would run on every character in a long post.
   */
  useEffect(() => {
    const id = window.setInterval(save, 3000);
    return () => window.clearInterval(id);
  }, [save]);

  /** Save on tab hide too — a closed tab never fires the interval again. */
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") save();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", save);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", save);
    };
  }, [save]);

  /**
   * Warn before leaving with unsaved work.
   *
   * The draft survives, but a reader who does not know that has just lost a
   * post as far as they can tell. The browser shows its own wording; the
   * returned string is required for older engines.
   */
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (submitted.current) return;
      const form = formRef.current;
      if (!form) return;
      const data = readForm(form);
      const dirty = Boolean(
        (data.title as string)?.trim() ||
          (data.content as string)?.replace(/<[^>]*>/g, "").trim(),
      );
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [formRef]);

  /** Put a stored draft back into the form. */
  const restore = useCallback((): Record<string, string | string[]> | null => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { data: Record<string, string | string[]> };
      setDraft({ found: false, savedAt: null });
      return parsed.data ?? null;
    } catch {
      return null;
    }
  }, [key]);

  /** Throw the draft away, without touching the form. */
  const discard = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch {
      /* nothing to do */
    }
    setDraft({ found: false, savedAt: null });
  }, [key]);

  /**
   * Called as a save begins.
   *
   * Optimistic: a successful save ends in redirect(), which throws
   * NEXT_REDIRECT, so no code after the action's await ever runs. Clearing
   * afterwards therefore never happened, and the draft outlived the post it
   * belonged to. Cleared up front and restored by reopenDraft() if the save
   * turns out to have failed.
   */
  const clearOnSubmit = useCallback(() => {
    submitted.current = true;
    try {
      localStorage.removeItem(key);
    } catch {
      /* nothing to do */
    }
    setSavedTick(null);
  }, [key]);

  /** The save failed after all — resume autosaving. */
  const reopenDraft = useCallback(() => {
    submitted.current = false;
    save();
  }, [save]);

  return { draft, savedTick, restore, discard, clearOnSubmit, reopenDraft, save };
}
