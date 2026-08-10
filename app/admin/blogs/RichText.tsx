"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";

/**
 * Rich text editor for post content.
 *
 * Replaces a raw HTML textarea. The toolbar is deliberately limited to the tags
 * the sanitiser in lib/public-blogs.ts allows through — offering a control that
 * produces markup the renderer then strips would be worse than not offering it,
 * because the author would see their formatting vanish only after publishing.
 *
 * H1 is excluded on purpose: the post template already renders the title as the
 * page's single H1, and a second one in the body is an SEO regression. Authors
 * get H2/H3/H4, which is the correct hierarchy beneath it.
 *
 * The value is mirrored into a hidden input so the surrounding <form> and its
 * Server Action keep working unchanged — no client-side submit handler, and the
 * form still functions as a plain POST.
 */

type Props = {
  name: string;
  defaultValue: string;
};

/** True when the document has no text and nothing embedded — see the note below. */
function isBlank(html: string): boolean {
  const withoutTags = html.replace(/<(img|hr|iframe)\b[^>]*>/gi, "X").replace(/<[^>]*>/g, "");
  return withoutTags.replace(/&nbsp;|\s/g, "") === "";
}

function Btn({
  on,
  active,
  disabled,
  title,
  children,
}: {
  on: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`adm-rt__btn${active ? " is-on" : ""}`}
      // Buttons inside a form default to type="submit"; without the explicit
      // type above, every toolbar click would save the post.
      onMouseDown={(e) => e.preventDefault()}
      onClick={on}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor, onPickImage }: { editor: Editor; onPickImage: () => void }) {
  // Re-render the toolbar as the selection moves, so the active states track
  // the cursor rather than freezing at their first-paint values.
  const [, force] = useState(0);
  useEffect(() => {
    const bump = () => force((n) => n + 1);
    editor.on("selectionUpdate", bump);
    editor.on("transaction", bump);
    return () => {
      editor.off("selectionUpdate", bump);
      editor.off("transaction", bump);
    };
  }, [editor]);

  const link = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  /**
   * Insert an image by uploading from the device rather than pasting a path.
   * The hidden file input lives in the parent so a single element serves the
   * toolbar button, drag-and-drop and paste.
   */
  const image = () => onPickImage();

  return (
    <div className="adm-rt__bar">
      <Btn on={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
        <strong>B</strong>
      </Btn>
      <Btn on={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
        <em>I</em>
      </Btn>
      <Btn on={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline">
        <u>U</u>
      </Btn>
      <Btn on={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
        <s>S</s>
      </Btn>
      <Btn on={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline code">
        {"</>"}
      </Btn>

      <span className="adm-rt__sep" />

      <Btn on={() => editor.chain().focus().setParagraph().run()} active={editor.isActive("paragraph")} title="Paragraph">
        ¶
      </Btn>
      {([2, 3, 4] as const).map((level) => (
        <Btn
          key={level}
          on={() => editor.chain().focus().toggleHeading({ level }).run()}
          active={editor.isActive("heading", { level })}
          title={`Heading ${level}`}
        >
          H{level}
        </Btn>
      ))}

      <span className="adm-rt__sep" />

      {/* Alignment. Icons are drawn as stacked rules so the state is readable
          at a glance rather than relying on a letter. */}
      {(
        [
          ["left", "Align left", [16, 10, 16, 10]],
          ["center", "Align centre", [16, 10, 16, 10]],
          ["right", "Align right", [16, 10, 16, 10]],
          ["justify", "Justify", [16, 16, 16, 16]],
        ] as const
      ).map(([align, label, widths]) => (
        <Btn
          key={align}
          on={() => editor.chain().focus().setTextAlign(align).run()}
          active={editor.isActive({ textAlign: align })}
          title={label}
        >
          <svg width="15" height="15" viewBox="0 0 18 18" aria-hidden="true">
            {widths.map((w, i) => {
              const x = align === "right" ? 17 - w : align === "center" ? (18 - w) / 2 : 1;
              return (
                <rect key={i} x={x} y={2.5 + i * 3.4} width={w} height="1.5" rx="0.75" fill="currentColor" />
              );
            })}
          </svg>
        </Btn>
      ))}

      <span className="adm-rt__sep" />

      <Btn on={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bulleted list">
        •&nbsp;—
      </Btn>
      <Btn on={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered list">
        1.
      </Btn>
      <Btn on={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Quote">
        &rdquo;
      </Btn>
      <Btn on={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code block">
        {"{ }"}
      </Btn>
      <Btn on={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">
        —
      </Btn>

      <span className="adm-rt__sep" />

      <Btn on={link} active={editor.isActive("link")} title="Insert or edit link">
        Link
      </Btn>
      <Btn on={image} title="Insert image">
        Image
      </Btn>
      <Btn
        on={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        title="Clear formatting"
      >
        Clear
      </Btn>

      <span className="adm-rt__sep" />

      <Btn on={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
        ↶
      </Btn>
      <Btn on={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
        ↷
      </Btn>
    </div>
  );
}

export default function RichText({ name, defaultValue }: Props) {
  const [html, setHtml] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  // Held in a ref so the ProseMirror event handlers below, which are created
  // once, always reach the live editor instance rather than a stale closure.
  const editorRef = useRef<Editor | null>(null);

  const uploadImage = useCallback(async (file: File) => {
    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setUploadError(data.error ?? "Upload failed.");
        return;
      }
      editorRef.current
        ?.chain()
        .focus()
        .setImage({ src: data.url, alt: file.name.replace(/\.[^.]+$/, "") })
        .run();
    } catch {
      setUploadError("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }, []);

  const editor = useEditor({
    // Tiptap renders on the client only; without this Next warns about an SSR
    // hydration mismatch on every edit screen.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        // Only the levels the post template styles, and never H1 — see above.
        heading: { levels: [2, 3, 4] },
        /**
         * StarterKit ships its own Link and Underline. Registering the
         * standalone packages as well produced "Duplicate extension names
         * found: ['link', 'underline']" and left the editor in a state where
         * the surrounding form silently stopped submitting — a failed save
         * could never be retried without reloading the page.
         *
         * Disabled here so the configured versions below are the only ones,
         * rather than dropping ours: Link needs the protocol allow-list and the
         * rel/target attributes that StarterKit's default does not set.
         */
        link: false,
        underline: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        // Matches the sanitiser's URI allow-list, so a scheme accepted here is
        // never dropped at render time.
        protocols: ["http", "https", "mailto", "tel"],
        HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" },
      }),
      Image.configure({ inline: false }),
      Underline,
      /**
       * Alignment writes `style="text-align:…"` onto the node. The sanitiser in
       * lib/public-blogs.ts allow-lists exactly that declaration and those four
       * values, so what an author sets here is what ships — offering a control
       * whose output is stripped at render would be worse than not offering it.
       */
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: defaultValue,
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
    editorProps: {
      attributes: { class: "adm-rt__area", spellcheck: "true" },
      /**
       * Dropping or pasting an image uploads it instead of embedding it as a
       * base64 data URI. Without this, ProseMirror's default would inline the
       * whole file into the document — bloating the stored HTML by megabytes
       * and, since data: URIs are outside the sanitiser's allow-list, the
       * image would then be stripped and lost at render time.
       */
      handleDrop: (_view, event) => {
        const files = Array.from((event as DragEvent).dataTransfer?.files ?? []);
        const images = files.filter((f) => f.type.startsWith("image/"));
        if (images.length === 0) return false;
        event.preventDefault();
        images.forEach((f) => void uploadImage(f));
        return true;
      },
      handlePaste: (_view, event) => {
        const files = Array.from((event as ClipboardEvent).clipboardData?.files ?? []);
        const images = files.filter((f) => f.type.startsWith("image/"));
        if (images.length === 0) return false;
        event.preventDefault();
        images.forEach((f) => void uploadImage(f));
        return true;
      },
    },
  });

  editorRef.current = editor;

  return (
    /**
     * The hidden input and the file input are SIBLINGS of the editor box, not
     * children of it.
     *
     * <EditorContent> hands its subtree to Tiptap, which mutates that DOM
     * outside React's knowledge. When useActionState re-rendered the form after
     * a validation error, reconciling around that foreign subtree detached the
     * surrounding inputs from form.elements — measured at one surviving input
     * out of a dozen, on an unchanged <form> node. The form then looked normal,
     * showed the error, and submitted nothing at all: clicking Save fired no
     * request, so a post could never be saved after one failed attempt without
     * reloading. (That is why a second browser "worked" — it was a fresh mount.)
     *
     * Keeping the form-bearing inputs outside .adm-rt puts them beyond the
     * subtree React struggles to reconcile, so they survive the re-render.
     */
    <>
      <div className="adm-rt">
        {editor && <Toolbar editor={editor} onPickImage={() => fileInput.current?.click()} />}
        <EditorContent editor={editor} />

        {uploading && <div className="adm-rt__status">Uploading image…</div>}
        {uploadError && <div className="adm-error adm-rt__status">{uploadError}</div>}
      </div>

      <input
        ref={fileInput}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void uploadImage(f);
          e.target.value = "";
        }}
      />
      {/*
        The form posts this, not the contenteditable div. Tiptap emits markup
        like "<p></p>" or "<p><br></p>" for a document the author has only
        pressed Enter in, which would satisfy `required` while being empty in
        practice — so anything with no text content is normalised to "" and the
        server-side schema rejects it properly.
      */}
      <input type="hidden" name={name} value={isBlank(html) ? "" : html} />
    </>
  );
}
