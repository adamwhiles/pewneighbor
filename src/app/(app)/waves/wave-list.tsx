"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Wave {
  id: string;
  createdAt: Date;
  sender?: {
    id: string;
    displayName: string;
    ageRange: string;
    aboutMe: string | null;
    isCouple: boolean;
    partnerName: string | null;
    interests: Array<{ interest: { label: string } | null }>;
  };
  recipient?: {
    id: string;
    displayName: string;
    ageRange: string;
    aboutMe: string | null;
    isCouple: boolean;
    partnerName: string | null;
    interests: Array<{ interest: { label: string } | null }>;
  };
}

interface WaveListProps {
  waves: Wave[];
  direction: "incoming" | "outgoing";
}

export function WaveList({ waves, direction }: WaveListProps) {
  const router = useRouter();
  const [responding, setResponding] = useState<Record<string, "accepting" | "declining">>();
  const [responded, setResponded] = useState<Record<string, "accepted" | "declined">>({});

  async function respond(waveId: string, action: "accept" | "decline") {
    setResponding((prev) => ({ ...prev, [waveId]: action === "accept" ? "accepting" : "declining" }));

    try {
      const res = await fetch("/api/waves", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ waveId, action }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error ?? "Something went wrong.");
        return;
      }

      setResponded((prev) => ({ ...prev, [waveId]: action === "accept" ? "accepted" : "declined" }));

      if (action === "accept" && data.connectionId) {
        // Navigate to the new connection's chat
        router.push(`/messages/${data.connectionId}`);
      }
    } finally {
      setResponding((prev) => {
        const next = { ...prev };
        delete next?.[waveId];
        return next;
      });
    }
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {waves.map((wave) => {
        const person = direction === "incoming" ? wave.sender : wave.recipient;
        if (!person) return null;

        const respondedStatus = responded[wave.id];
        const isAccepted = respondedStatus === "accepted";
        const isDeclined = respondedStatus === "declined";

        return (
          <Card key={wave.id} className={isDeclined ? "opacity-50" : ""}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-900">
                    {person.isCouple && person.partnerName
                      ? person.partnerName
                      : person.displayName}
                  </p>
                  <p className="text-sm text-slate-500">{person.ageRange}</p>
                </div>
                <span className="text-xs text-slate-400">
                  {formatRelativeTime(new Date(wave.createdAt))}
                </span>
              </div>

              {person.aboutMe && (
                <p className="text-sm text-slate-600 line-clamp-2">
                  {person.aboutMe}
                </p>
              )}

              {person.interests.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {person.interests.slice(0, 3).map((pi) =>
                    pi.interest ? (
                      <span
                        key={pi.interest.label}
                        className="rounded-full bg-navy-50 px-2 py-0.5 text-xs text-navy-700"
                      >
                        {pi.interest.label}
                      </span>
                    ) : null
                  )}
                </div>
              )}

              {direction === "incoming" && !respondedStatus && (
                <div className="flex gap-2 pt-1">
                  <Button
                    onClick={() => respond(wave.id, "accept")}
                    loading={responding?.[wave.id] === "accepting"}
                    size="sm"
                    className="flex-1"
                  >
                    Wave back 👋
                  </Button>
                  <Button
                    onClick={() => respond(wave.id, "decline")}
                    loading={responding?.[wave.id] === "declining"}
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-slate-500"
                  >
                    Not now
                  </Button>
                </div>
              )}

              {isAccepted && (
                <div className="rounded-lg bg-green-50 p-2 text-center text-sm font-medium text-green-700">
                  🎉 Connected! Opening chat...
                </div>
              )}

              {isDeclined && (
                <p className="text-center text-xs text-slate-400">Declined</p>
              )}

              {direction === "outgoing" && !respondedStatus && (
                <p className="text-xs text-slate-400 text-center">
                  Waiting for them to wave back...
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
