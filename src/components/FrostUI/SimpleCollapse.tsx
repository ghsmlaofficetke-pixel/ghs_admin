import { ElementType, FC, RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';

interface CollapseProps {
  open: boolean;
  children: any;
  classNames?: string;
  as?: ElementType;
}

const SimpleCollapse: FC<CollapseProps> = ({ open, children, classNames, as: tag = "div" }) => {
  const ref: RefObject<HTMLDivElement> = useRef(null);
  const [height, setHeight] = useState<number | "auto">(open ? "auto" : 0);
  const Tag = tag;

  // Measure AFTER the DOM has committed (not during render) so the
  // full, correct content height is used — fixes submenus getting
  // cut off on first open, especially on mobile.
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (open) {
      setHeight(node.scrollHeight);
    } else {
      // Set an explicit starting height first (in case it was "auto"),
      // then collapse to 0 on the next frame so the transition animates.
      setHeight(node.scrollHeight);
      requestAnimationFrame(() => setHeight(0));
    }
  }, [open]);

  // Keep the height in sync while open — e.g. when a nested sub-menu
  // inside this one expands/collapses, or on orientation change /
  // text reflow (long Kannada labels wrapping to 2 lines on mobile).
  useEffect(() => {
    const node = ref.current;
    if (!node || !open) return;
    if (typeof ResizeObserver === "undefined") return;

    const resizeObserver = new ResizeObserver(() => {
      setHeight(node.scrollHeight);
    });
    resizeObserver.observe(node);

    return () => resizeObserver.disconnect();
  }, [open]);

  // Once the open transition finishes, switch to "auto" so the
  // submenu is never clipped by a stale pixel value (e.g. if content
  // changes without a resize event, or during fast taps on mobile).
  const handleTransitionEnd = () => {
    if (open) setHeight("auto");
  };

  return (
    <Tag
      ref={ref}
      onTransitionEnd={handleTransitionEnd}
      className={`transition-all overflow-hidden ${classNames ? classNames : ''}`}
      style={{ height }}
    >
      {children}
    </Tag>
  );
};

export default SimpleCollapse;