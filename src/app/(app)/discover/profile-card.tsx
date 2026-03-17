"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProfileCardProps {
  profile: {
    id: string;
    displayName: string;
    ageRange: string;
    isCouple: boolean;
    partnerName: string | null;
    partnerAgeRange: string | null;
    lookingFor: string;
    availability: string[];
    aboutMe: string | null;
    interests: Array<{
      interest: { label: string; category: string } | null;
    }>;
  };
  currentProfileId: string;
}

const AVAILABILITY_LABELS: Record<string, string> = {
  weekends: "Weekends",
  weekday_evenings: "Weekday evenings",
  flexible: "Flexible",
};

const LOOKING_FOR_LABELS: Record<string, string> = {
  individual: "Individual friends",
  couple: "Couple friends",
  both: "Open to both",
};

export function ProfileCard({ profile, currentProfileId }: ProfileCardProps) {
  const [waveStatus, setWaveStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function sendWave() {
    setWaveStatus("sending");
    try {
      const res = await fetch("/api/waves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientProfileId: profile.id }),
      });
      if (!res.ok) throw new Error();
      setWaveStatus("sent");
    } catch {
      setWaveStatus("error");
    }
  }

  return (
    <Card
      className={cn(
        "transition-shadow hover:shadow-md",
        waveStatus === "sent" && "opacity-75"
      )}
    >
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 text-lg">
              {profile.isCouple && profile.partnerName
                ? profile.partnerName
                : profile.displayName}
            </h3>
            <p className="text-sm text-slate-500">
              {profile.isCouple && profile.partnerAgeRange
                ? `${profile.ageRange} & ${profile.partnerAgeRange}`
                : profile.ageRange}
            </p>
          </div>
          {profile.isCouple && (
            <Badge variant="secondary">👫 Couple</Badge>
          )}
        </div>

        {/* About me */}
        {profile.aboutMe && (
          <p className="text-sm text-slate-600 line-clamp-3">{profile.aboutMe}</p>
        )}

        {/* Interests */}
        {profile.interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {profile.interests.slice(0, 4).map((pi) =>
              pi.interest ? (
                <span
                  key={pi.interest.label}
                  className="rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-medium text-navy-700"
                >
                  {pi.interest.label}
                </span>
              ) : null
            )}
            {profile.interests.length > 4 && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500">
                +{profile.interests.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <span>
            🔍 {LOOKING_FOR_LABELS[profile.lookingFor] ?? profile.lookingFor}
          </span>
          {profile.availability.length > 0 && (
            <span>
              📅 {profile.availability
                .map((a) => AVAILABILITY_LABELS[a] ?? a)
                .join(", ")}
            </span>
          )}
        </div>

        {/* Wave button */}
        <div className="pt-1">
          {waveStatus === "sent" ? (
            <div className="flex items-center justify-center gap-2 rounded-lg bg-green-50 py-2 text-sm font-medium text-green-700">
              👋 Wave sent!
            </div>
          ) : (
            <Button
              onClick={sendWave}
              loading={waveStatus === "sending"}
              className="w-full"
              size="sm"
            >
              👋 Wave
            </Button>
          )}
          {waveStatus === "error" && (
            <p className="mt-1 text-center text-xs text-red-600">
              Something went wrong. Try again.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
