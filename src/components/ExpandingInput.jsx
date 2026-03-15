import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Eye } from "lucide-react";
import "../css/exercises/ExpandingInput.css";

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
                                           mobileMinWidth,
                                           tabletMinWidth,
                                           maxWidth = 280,
                                           extraWidth = 2,
                                           enableHint = false,
                                           hintValue = "",
                                           ...props
                                       }) {
    const inputRef = useRef(null);
    const measureRef = useRef(null);
    const [viewportWidth, setViewportWidth] = useState(() =>
        typeof window !== "undefined" ? window.innerWidth : 1201
    );
    const isMobile = viewportWidth <= 600;
    const isTablet = viewportWidth > 600 && viewportWidth <= 1200;

    const [isHintVisible, setIsHintVisible] = useState(false);

    // Auto-hide hint after 2 seconds
    useEffect(() => {
        if (isHintVisible) {
            const timer = setTimeout(() => setIsHintVisible(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isHintVisible]);

    const displayValue = isHintVisible ? hintValue : value;

    // Check if the input is correct (has 'correct' class) or if the current value matches the hint
    const isCorrect = (className || "").includes("correct") && !(className || "").includes("incorrect");
    const isValueMatchingHint = value === hintValue && hintValue !== "";

    const shouldShowEye = enableHint && !isCorrect && !isValueMatchingHint;

    const effectiveMinWidth = isMobile && mobileMinWidth != null
        ? mobileMinWidth
        : isTablet && tabletMinWidth != null
            ? tabletMinWidth
            : minWidth;
    const [width, setWidth] = useState(effectiveMinWidth);

    const hasRealPlaceholder = placeholder != null && String(placeholder).length > 0;
    const ghostPlaceholder = "\u00A0"; // NBSP
    const placeholderForRender = hasRealPlaceholder ? placeholder : ghostPlaceholder;

    const textToMeasure = useMemo(() => {
        const v = String(displayValue ?? "");
        const ph = String(placeholder ?? "");
        const src = v.length > 0 ? v : ph;
        return (src || "\u00A0").replace(/ /g, "\u00A0");
    }, [displayValue, placeholder]);

    useEffect(() => {
        if (typeof window === "undefined") return undefined;

        const handleResize = () => setViewportWidth(window.innerWidth);
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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

        setWidth(Math.min(maxWidth, Math.max(effectiveMinWidth, nextWidth)));
    }, [textToMeasure, effectiveMinWidth, maxWidth, extraWidth, shouldShowEye]);

    const inputClasses = [
        `expanding-input__input`,
        className,
        shouldShowEye ? "expanding-input__input--with-hint" : ""
    ].filter(Boolean).join(" ");

    return (
        <span className="expanding-input__field-wrap">
          <span className="expanding-input__wrap">
              <span ref={measureRef} className="expanding-input__measure" aria-hidden="true" />
              <input
                  ref={inputRef}
                  value={displayValue}
                  placeholder={placeholderForRender}
                  data-ghost-placeholder={hasRealPlaceholder ? undefined : "true"}
                  className={inputClasses}
                  style={{ ...style, width }}
                  readOnly={isHintVisible || props.readOnly}
                  {...props}
              />
          </span>
          {shouldShowEye && (
              <button 
                  type="button"
                  className="expanding-input__eye-button"
                  onClick={(e) => {
                      e.preventDefault(); 
                      setIsHintVisible(true);
                  }}
                  aria-label="Show hint"
                  tabIndex="-1"
              >
                  <Eye /> 
              </button>
          )}
        </span>
    );
}
