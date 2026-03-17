"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ApproveChurchButtonProps {
  orgId: string;
  action: "approve" | "reject";
}

export function ApproveChurchButton({ orgId, action }: ApproveChurchButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/churches", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId, action }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error ?? "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleClick}
      loading={loading}
      variant={action === "approve" ? "primary" : "danger"}
      size="sm"
    >
      {action === "approve" ? "✓ Approve" : "✕ Reject"}
    </Button>
  );
}
