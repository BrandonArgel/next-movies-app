import type { SVGProps } from "react";

interface CineIconProps extends SVGProps<SVGSVGElement> {
  cupClassName?: string;
}

export default function CinemaIcon({
  cupClassName = "text-[#00A0E9]",
  ...props
}: CineIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      width="100%"
      height="100%"
      {...props}
    >
      <defs>
        <clipPath id="bucket-clip">
          <polygon points="50,225 360,225 330,480 80,480" />
        </clipPath>
        <clipPath id="cup-clip">
          <polygon points="335,310 475,310 455,490 355,490" />
        </clipPath>

        <g id="popcorn-flying">
          <circle cx="-12" cy="-12" r="16" fill="#FBB040" />
          <circle cx="14" cy="-14" r="14" fill="#FBB040" />
          <circle cx="-16" cy="10" r="13" fill="#FBB040" />
          <circle cx="12" cy="12" r="15" fill="#FBB040" />
          <circle cx="0" cy="0" r="14" fill="#FBB040" />
        </g>

        <g id="popcorn-bucket">
          <circle cx="-12" cy="8" r="16" fill="#C88A36" />
          <circle cx="14" cy="6" r="14" fill="#C88A36" />
          <circle cx="-16" cy="18" r="13" fill="#C88A36" />
          <circle cx="12" cy="18" r="15" fill="#C88A36" />
          <circle cx="0" cy="12" r="14" fill="#C88A36" />
          <circle cx="-12" cy="-12" r="16" fill="#FBB040" />
          <circle cx="14" cy="-14" r="14" fill="#FBB040" />
          <circle cx="-16" cy="2" r="13" fill="#FBB040" />
          <circle cx="12" cy="4" r="15" fill="#FBB040" />
          <circle cx="0" cy="-5" r="14" fill="#FBB040" />
        </g>
      </defs>

      <use href="#popcorn-bucket" x="70" y="185" />
      <use href="#popcorn-bucket" x="110" y="170" />
      <use href="#popcorn-bucket" x="160" y="175" />
      <use href="#popcorn-bucket" x="210" y="160" />
      <use href="#popcorn-bucket" x="260" y="170" />
      <use href="#popcorn-bucket" x="310" y="185" />
      <use href="#popcorn-bucket" x="90" y="200" />
      <use href="#popcorn-bucket" x="140" y="205" />
      <use href="#popcorn-bucket" x="190" y="200" />
      <use href="#popcorn-bucket" x="240" y="205" />
      <use href="#popcorn-bucket" x="290" y="200" />
      <use href="#popcorn-bucket" x="330" y="210" />

      <use href="#popcorn-flying" transform="translate(70, 70) rotate(-15)" />
      <use href="#popcorn-flying" transform="translate(150, 110) rotate(20)" />
      <use href="#popcorn-flying" transform="translate(240, 95) rotate(5)" />
      <use href="#popcorn-flying" transform="translate(340, 75) rotate(35)" />

      <g clipPath="url(#bucket-clip)" className={cupClassName}>
        <rect x="0" y="225" width="500" height="300" fill="#E6E6E6" />
        <rect x="43" y="225" width="36" height="300" fill="currentColor" />
        <rect x="115" y="225" width="36" height="300" fill="currentColor" />
        <rect x="187" y="225" width="36" height="300" fill="currentColor" />
        <rect x="259" y="225" width="36" height="300" fill="currentColor" />
        <rect x="331" y="225" width="36" height="300" fill="currentColor" />
      </g>

      <rect x="40" y="200" width="330" height="25" fill="#E6E6E6" rx="3" />
      <circle cx="205" cy="350" r="65" fill="#E6E6E6" />

      <g className={cupClassName}>
        <polygon points="410,280 425,280 425,180 410,180" fill="currentColor" />
        <polygon
          points="410,280 425,280 425,180 410,180"
          fill="#000"
          fillOpacity={0.15}
        />

        <polygon points="410,180 425,180 445,130 430,130" fill="currentColor" />
      </g>

      <g clipPath="url(#cup-clip)" className={cupClassName}>
        <rect x="300" y="310" width="200" height="200" fill="currentColor" />
        <polygon
          points="300,370 500,400 500,450 300,420"
          fill="#000"
          fillOpacity={0.15}
        />
      </g>

      <polygon points="335,265 475,265 485,295 325,295" fill="#E6E6E6" />
      <rect x="320" y="295" width="170" height="15" fill="#CCCCCC" rx="2" />
    </svg>
  );
}
