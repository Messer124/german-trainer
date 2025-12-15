import { useLayoutEffect, useMemo, useRef, useState } from "react";

const pickFontStyles = (cs) => ({
    fontFamily: cs.fontFamily,
    fontSize: cs.fontSize,
    fontWeight: cs.fontWeight,
    fontStyle: cs.fontStyle,
    fontVariant: cs.fontVariant,
    letterSpacing: cs.letterSpacing,
    textTransform: cs.textTransform,
    textIndent: cs.textIndent,
    textRendering: cs.textRendering,
    wordSpacing: cs.wordSpacing,
});

export default function ExpandingInput({
                                           value,
                                           placeholder,
                                           className = "",
                                           style,
                                           minWidth = 40,
                                           maxWidth = 280,
                                           extraWidth = 2,
                                           ...props
                                       }) {
    const inputRef = useRef(null);
    const measureRef = useRef(null);
    const [width, setWidth] = useState(minWidth);

    const textToMeasure = useMemo(() => {
        const v = String(value ?? "");
        const ph = String(placeholder ?? "");
        const src = v.length > 0 ? v : ph;
        return (src || "\u00A0").replace(/ /g, "\u00A0");
    }, [value, placeholder]);

    useLayoutEffect(() => {
        const input = inputRef.current;
        const measure = measureRef.current;
        if (!input || !measure) return;

        const cs = window.getComputedStyle(input);
        Object.assign(measure.style, pickFontStyles(cs));

        measure.textContent = textToMeasure;

        const paddingLeft = parseFloat(cs.paddingLeft) || 0;
        const paddingRight = parseFloat(cs.paddingRight) || 0;
        const borders =
            (parseFloat(cs.borderLeftWidth) || 0) + (parseFloat(cs.borderRightWidth) || 0);

        const measuredTextWidth = Math.ceil(measure.getBoundingClientRect().width);
        const nextWidth = measuredTextWidth + paddingLeft + paddingRight + borders + extraWidth;

        setWidth(Math.min(maxWidth, Math.max(minWidth, nextWidth)));
    }, [textToMeasure, minWidth, maxWidth, extraWidth]);

    return (
        <span className="expanding-input__wrap">
      <span ref={measureRef} className="expanding-input__measure" aria-hidden="true" />
      <input
          ref={inputRef}
          value={value}
          placeholder={placeholder}
          className={`expanding-input__input ${className}`.trim()}
          style={{ ...style, width }}
          {...props}
      />
    </span>
    );
}