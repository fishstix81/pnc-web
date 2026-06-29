import {ReactElement} from "react";

export const Footer = (): ReactElement => {
  return (
      <footer className="bg-navy-dark px-7 py-4.5">
          <span className="text-sm text-stone-500">© {new Date().getFullYear()} Praise & Confused</span>
      </footer>
  );
};