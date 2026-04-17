import React from "react";

export default function SkeletonContent() {
  return (
    <div className="skeleton-container" aria-hidden="true">
      <div className="skeleton-line skeleton-line-full" />
      <div className="skeleton-line skeleton-line-full" />
      <div className="skeleton-line skeleton-line-medium" />
    </div>
  );
}
