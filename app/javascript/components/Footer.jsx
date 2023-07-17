import React from "react";
import { COPY } from "../constants";

export const Footer = () => (
  <>
    <label className="Credits">{COPY.credits}</label>
    <label className="Credits">
      View source: <a href={COPY.sourceUrl}>{COPY.sourceText}</a>
    </label>
  </>
);
