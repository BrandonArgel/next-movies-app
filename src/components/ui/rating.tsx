"use client";

import type React from "react";
import {
  type CSSProperties,
  Fragment,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { Direction } from "@/lib/locale-utils";
import { Tooltip, TooltipTrigger } from "./tooltip";

export interface StarIconProps {
  size?: number;
  SVGstrokeColor?: string;
  SVGstorkeWidth?: string | number;
  SVGclassName?: string;
  SVGstyle?: React.CSSProperties;
}

export function StarIcon({
  size = 25,
  SVGstrokeColor = "currentColor",
  SVGstorkeWidth = 0,
  SVGclassName = "star-svg",
  SVGstyle,
}: StarIconProps) {
  return (
    <svg
      className={`shrink-0 ${SVGclassName}`}
      style={SVGstyle}
      stroke={SVGstrokeColor}
      fill="currentColor"
      strokeWidth={SVGstorkeWidth}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
    </svg>
  );
}

type State = {
  ratingValue: number | null;
  hoverValue: number | null;
  hoverIndex: number;
  valueIndex: number;
};

type Action =
  | { type: "PointerMove"; payload: number | null; index: number }
  | { type: "PointerLeave" }
  | { type: "MouseClick"; payload: number };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "PointerMove":
      return {
        ...state,
        hoverValue: action.payload,
        hoverIndex: action.index,
      };
    case "PointerLeave":
      return {
        ...state,
        ratingValue: state.ratingValue,
        hoverIndex: 0,
        hoverValue: null,
      };
    case "MouseClick":
      return {
        ...state,
        valueIndex: state.hoverIndex,
        ratingValue: action.payload,
      };
    default:
      return state;
  }
}

export interface RatingProps extends StarIconProps {
  onClick?: (
    value: number,
    index: number,
    event?: MouseEvent<HTMLSpanElement>,
  ) => void;
  onPointerMove?: (
    value: number,
    index: number,
    event: PointerEvent<HTMLSpanElement>,
  ) => void;
  onPointerEnter?: (event: PointerEvent<HTMLSpanElement>) => void;
  onPointerLeave?: (event: PointerEvent<HTMLSpanElement>) => void;
  initialValue?: number;
  iconsCount?: number;
  readonly?: boolean;
  customIcons?: { icon: ReactNode }[];
  direction?: Direction;
  allowFraction?: boolean;
  allowHover?: boolean;
  disableFillHover?: boolean;
  transition?: boolean;
  className?: string;
  style?: CSSProperties;
  fillIcon?: ReactNode | null;
  fillColor?: string;
  fillColorArray?: string[];
  fillStyle?: CSSProperties;
  fillClassName?: string;
  emptyIcon?: ReactNode | null;
  emptyColor?: string;
  emptyStyle?: CSSProperties;
  emptyClassName?: string;
  allowTitleTag?: boolean;
  showTooltip?: boolean;
  tooltipDefaultText?: string;
  tooltipArray?: string[];
  tooltipStyle?: CSSProperties;
  tooltipClassName?: string;
  titleSeparator?: string;
}

function isTouchDevice() {
  return (
    (typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches) ||
    (typeof window !== "undefined" && "ontouchstart" in window) ||
    (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0)
  );
}

export function Rating({
  onClick,
  onPointerMove,
  onPointerEnter,
  onPointerLeave,
  initialValue = 0,
  iconsCount = 5,
  size = 40,
  readonly = false,
  direction = "ltr",
  customIcons = [],
  allowFraction = false,
  style,
  className = "",
  transition = false,
  allowHover = true,
  disableFillHover = false,
  fillIcon = null,
  fillColor = "#ffbc0b",
  fillColorArray = [],
  fillStyle,
  fillClassName = "",
  emptyIcon = null,
  emptyColor = "#cccccc",
  emptyStyle,
  emptyClassName = "",
  allowTitleTag = true,
  showTooltip = false,
  tooltipDefaultText = "Your Rate",
  tooltipArray = [],
  tooltipStyle,
  tooltipClassName = "",
  SVGclassName = "star-svg",
  titleSeparator = "out of",
  SVGstyle,
  SVGstorkeWidth = 0,
  SVGstrokeColor = "currentColor",
}: RatingProps) {
  const [{ ratingValue, hoverValue, hoverIndex, valueIndex }, dispatch] =
    useReducer(reducer, {
      hoverIndex: 0,
      valueIndex: 0,
      ratingValue: initialValue,
      hoverValue: null,
    });

  useEffect(() => {
    if (initialValue) dispatch({ type: "MouseClick", payload: 0 });
  }, [initialValue]);

  const totalIcons = useMemo(
    () => (allowFraction ? iconsCount * 2 : iconsCount),
    [allowFraction, iconsCount],
  );

  const localRating = useMemo(() => {
    if (initialValue > totalIcons) return 0;
    if (!allowFraction && Math.floor(initialValue) !== initialValue) {
      return Math.ceil(initialValue) * 2 * 10;
    }
    return Math.round((initialValue / iconsCount) * 100);
  }, [allowFraction, initialValue, iconsCount, totalIcons]);

  const localRatingIndex = useMemo(
    () => (allowFraction ? initialValue * 2 - 1 : initialValue - 1) || 0,
    [allowFraction, initialValue],
  );

  const renderValue = useCallback(
    (value: number) =>
      iconsCount % 2 !== 0 ? value / 2 / 10 : (value * iconsCount) / 100,
    [iconsCount],
  );

  const handlePointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    const { clientX, currentTarget } = event;
    const { left, right, width } =
      currentTarget.children[0].getBoundingClientRect();

    const rtl = direction === "rtl";
    const positionX = rtl ? right - clientX : clientX - left;

    let currentValue = totalIcons;
    const iconWidth = Math.round(width / totalIcons);

    for (let i = 0; i <= totalIcons; i = i + 1) {
      if (positionX <= iconWidth * i) {
        if (i === 0 && positionX < iconWidth) currentValue = 0;
        else currentValue = i;
        break;
      }
    }

    const index = currentValue - 1;

    if (currentValue > 0) {
      dispatch({
        type: "PointerMove",
        payload: (currentValue * 100) / totalIcons,
        index,
      });
      if (onPointerMove && hoverValue) {
        onPointerMove(renderValue(hoverValue), index, event);
      }
    }
  };

  const handlePointerEnter = (event: PointerEvent<HTMLSpanElement>) => {
    if (onPointerEnter) onPointerEnter(event);
    if (!isTouchDevice()) return;
    handlePointerMove(event);
  };

  const handleClick = (event?: MouseEvent<HTMLSpanElement>) => {
    if (hoverValue) {
      dispatch({ type: "MouseClick", payload: hoverValue });
      if (onClick) onClick(renderValue(hoverValue), hoverIndex, event);
    }
  };

  const handlePointerLeave = (event: PointerEvent<HTMLSpanElement>) => {
    if (isTouchDevice()) handleClick();
    dispatch({ type: "PointerLeave" });
    if (onPointerLeave) onPointerLeave(event);
  };

  const valuePercentage = useMemo(() => {
    if (allowHover) {
      if (disableFillHover) {
        const currentValue = (ratingValue && ratingValue) || localRating;
        return hoverValue && hoverValue > currentValue
          ? hoverValue
          : currentValue;
      }
      return (
        (hoverValue && hoverValue) ||
        (ratingValue && ratingValue) ||
        localRating
      );
    }
    return (ratingValue && ratingValue) || localRating;
  }, [allowHover, disableFillHover, hoverValue, ratingValue, localRating]);

  const ratingArray = useCallback(
    (array: string[]) => {
      const getIndex = (idx: number) =>
        allowFraction ? Math.floor(idx / 2) : idx;

      return (
        (hoverValue && array[getIndex(hoverIndex)]) ||
        (ratingValue && array[getIndex(valueIndex)]) ||
        (initialValue && array[getIndex(localRatingIndex)])
      );
    },
    [
      hoverValue,
      hoverIndex,
      ratingValue,
      valueIndex,
      initialValue,
      localRatingIndex,
      allowFraction,
    ],
  );

  const ratingRenderValues = useMemo(() => {
    return (
      (hoverValue && renderValue(hoverValue)) ||
      (ratingValue && renderValue(ratingValue)) ||
      (initialValue && renderValue(localRating))
    );
  }, [hoverValue, renderValue, ratingValue, initialValue, localRating]);

  const tooltipContent =
    (tooltipArray.length > 0
      ? ratingArray(tooltipArray)
      : ratingRenderValues) || tooltipDefaultText;

  return (
    <TooltipTrigger delay={0}>
      <span className="inline-flex items-center" dir={direction}>
        <span
          className={`relative inline-block touch-none select-none ${className}`}
          style={{
            cursor: readonly ? "default" : "pointer",
            ...style,
          }}
          onPointerMove={readonly ? undefined : handlePointerMove}
          onPointerEnter={readonly ? undefined : handlePointerEnter}
          onPointerLeave={readonly ? undefined : handlePointerLeave}
          onClick={readonly ? undefined : handleClick}
          aria-hidden="true"
        >
          <span
            className={`flex ${emptyClassName}`}
            style={{ color: emptyColor, ...emptyStyle }}
          >
            {[...Array(iconsCount)].map((_, index) => (
              <Fragment key={index}>
                {customIcons[index]?.icon || emptyIcon || (
                  <StarIcon
                    SVGclassName={SVGclassName}
                    SVGstyle={SVGstyle}
                    SVGstorkeWidth={SVGstorkeWidth}
                    SVGstrokeColor={SVGstrokeColor}
                    size={size}
                  />
                )}
              </Fragment>
            ))}
          </span>

          <span
            className={`absolute top-0 inset-s-0 flex overflow-hidden whitespace-nowrap ${fillClassName}`}
            style={{
              color: ratingArray(fillColorArray) || fillColor,
              transition: transition
                ? "width .2s ease, color .2s ease"
                : "none",
              width: `${valuePercentage}%`,
              ...fillStyle,
            }}
            title={
              allowTitleTag
                ? `${ratingRenderValues} ${titleSeparator} ${iconsCount}`
                : undefined
            }
          >
            {[...Array(iconsCount)].map((_, index) => (
              <Fragment key={index}>
                {customIcons[index]?.icon || fillIcon || (
                  <StarIcon
                    SVGclassName={SVGclassName}
                    SVGstyle={SVGstyle}
                    SVGstorkeWidth={SVGstorkeWidth}
                    SVGstrokeColor={SVGstrokeColor}
                    size={size}
                  />
                )}
              </Fragment>
            ))}
          </span>
        </span>

        {showTooltip && (
          <Tooltip className={tooltipClassName} style={tooltipStyle}>
            {tooltipContent}
          </Tooltip>
        )}
      </span>
    </TooltipTrigger>
  );
}
