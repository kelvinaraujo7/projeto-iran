"use client";

import { useState } from "react";
import { DetalhesModal } from "./DetalhesModal";

export default function TicketDigitalPage() {
  const [isOpen, setIsOpen] = useState(true);

  function onClose() {
    setIsOpen(false);
  }

  return (
    <>
      <DetalhesModal isOpen={isOpen} onClose={onClose} />
      
    </>
  );
}
