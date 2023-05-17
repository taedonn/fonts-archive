// custom.d.ts
import React from "react";

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    "data-link"?: string;
  }
}