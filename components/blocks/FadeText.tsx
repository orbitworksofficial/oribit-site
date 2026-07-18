import { Fragment } from "react";

/**
 * Port of modules/fade-text.
 *
 * The theme rewrote hero headings at runtime as:
 *   innerHTML.replaceAll('<br>', '\n')
 *   textContent.replace(/\S/g, '<span>$&</span>')
 *   innerHTML.replaceAll('\n', '<br/>')
 *
 * i.e. every NON-WHITESPACE CHARACTER becomes its own <span>, spaces stay as
 * bare text, and line breaks become <br/>. theme.css then fades each span in on
 * a 40ms stagger (nth-child(2) = 1.08s, (3) = 1.12s ... + var(--delay)).
 *
 * Two things must not be "simplified":
 *  - Split per character, not per word — the delays are per glyph.
 *  - Keep <br/> as a real element child. nth-child counts elements, so the <br>
 *    occupies an index and the spans after it shift by one. That skipped beat at
 *    the line break is part of the timing, not an accident.
 *
 * Done at render time so the markup is in the HTML, rather than rewritten after
 * hydration as the original did.
 */
export default function FadeText({ text }: { text: string }) {
  return (
    <>
      {[...text].map((char, i) => {
        // A <br/> alone joins textContent with no gap ("with" + "Scalable" =
        // "withScalable"), which is what crawlers and screen readers read out.
        // The trailing space fixes the extracted text and collapses visually at
        // the start of the next line, so the layout is unchanged. It is a text
        // node, so it does not shift the nth-child stagger either.
        if (char === "\n")
          return (
            <Fragment key={i}>
              <br />{" "}
            </Fragment>
          );
        if (/\s/.test(char)) return <Fragment key={i}>{char}</Fragment>;
        return <span key={i}>{char}</span>;
      })}
    </>
  );
}
