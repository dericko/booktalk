import React from "react";
import { BOOK_INFO, COPY } from "../constants";

export const Header = ({ handleReset }) => (
    <div className="HeadingContainer">
      <a href={BOOK_INFO.amazonLink}>
        <img src={BOOK_INFO.imageUrl} alt={BOOK_INFO.imageAlt} />
      </a>
      <a href="/" onClick={handleReset}>
        <h1>{COPY.heading}</h1>
      </a>
    </div>
  );
