import { JSX, ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClose: () => void;
};

export const OverlayModal = ({ children, onClose }: Props): JSX.Element => (
  <div
    onClick={onClose}
    className="fixed bg-black/50 flex justify-center items-center h-screen w-screen z-40 left-0 top-0 cursor-pointer"
  >
    {children}
  </div>
);
