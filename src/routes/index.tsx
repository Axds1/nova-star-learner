import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NovaProvider } from "@/lib/nova-context";
import { StarsBackground } from "@/components/StarsBackground";
import { LilyDecor } from "@/components/LilyDecor";
import { MatrixLoader } from "@/components/MatrixLoader";
import { TopBar } from "@/components/TopBar";
import { AgeSelect, type AgeGroup } from "@/components/nova/AgeSelect";
import { GenderSelect } from "@/components/nova/GenderSelect";
import { TopicPrompt, type Mode } from "@/components/nova/TopicPrompt";
import { ResultView } from "@/components/nova/ResultView";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "نوفا — Nova · تعلّم تفاعلي مع أستر" },
      {
        name: "description",
        content:
          "نوفا منصة تعليمية تفاعلية بالواقع الافتراضي والمعزز، مع المساعد الذكي أستر باللغة العربية.",
      },
      { property: "og:title", content: "نوفا — Nova" },
      { property: "og:description", content: "تعلّم تفاعلي يجمع الوسائط والـ VR/AR مع المساعد الذكي أستر." },
    ],
  }),
  component: Index,
});

type Stage = "loader" | "gender" | "age" | "topic" | "result";

function Index() {
  return (
    <NovaProvider>
      <NovaApp />
    </NovaProvider>
  );
}

function NovaApp() {
  const [stage, setStage] = useState<Stage>("loader");
  const [age, setAge] = useState<AgeGroup | null>(null);
  const [topic, setTopic] = useState<string>("");
  const [mode, setMode] = useState<Mode>("explain");

  const back = () => {
    if (stage === "result") setStage("topic");
    else if (stage === "topic") setStage("age");
    else if (stage === "age") setStage("gender");
  };

  const showBack = stage === "age" || stage === "topic" || stage === "result";

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {stage !== "loader" && <StarsBackground />}
      {stage !== "loader" && <LilyDecor />}
      {stage !== "loader" && <TopBar onBack={showBack ? back : undefined} />}

      {stage === "loader" && <MatrixLoader onDone={() => setStage("gender")} />}

      {stage === "gender" && <GenderSelect onSelect={() => setStage("age")} />}

      {stage === "age" && (
        <AgeSelect
          onSelect={(g) => {
            setAge(g);
            setStage("topic");
          }}
        />
      )}

      {stage === "topic" && age && (
        <TopicPrompt
          age={age}
          onSubmit={(tp, md) => {
            setTopic(tp);
            setMode(md);
            setStage("result");
          }}
        />
      )}

      {stage === "result" && age && (
        <ResultView topic={topic} age={age} mode={mode} />
      )}
div[class*="lovable"], 
div[id*="lovable"],
a[href*="lovable.dev"],
[id^="lovable-"] {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
}
    </div>
  );
}

