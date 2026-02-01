"use client";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ContentTabs from "@/components/ContentTabs";
import ProgramCard from "@/components/ProgramCard";
import RecommendationCard from "@/components/RecommendationCard";
import { useSession } from "next-auth/react";
import { useGetApi } from "@/hooks/useApi";
import { useLanguage, useTranslation } from "@/i18n/client";

interface MainContentProps {
  toggleSidebar?: () => void;
}

const useGetRecommendations = () => {
  const apiPathPrefix = "recommendations";
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  // TODO: APIから取得するように変更する
  const isPending = false;
  const error = null;
  // const { data: _, isPending, error } = useGetApi(
  //   `${apiPathPrefix}`,
  //   { type: "recommendations" },
  //   "recommendations",
  // );

  const recommendations = [
    {
      imageUrl: "https://picsum.photos/80/80?random=2",
      title: "2分間の瞑想",
      description: "簡単でほっと一息つきましょう",
      tagIcon: "🎵",
      tagLabel: "瞑想",
    },
    {
      imageUrl: "https://picsum.photos/80/80?random=3",
      title: "自分をワクワクさせる",
      description: "今日の瞑想",
      tagIcon: "🎵",
      tagLabel: "瞑想",
    },
    {
      imageUrl: "https://picsum.photos/80/80?random=4",
      title: "砂粒",
      description: "海岸からのおすすめコンテンツ",
      tagIcon: "🎵",
      tagLabel: "ミュージック",
    },
  ];
  return { recommendations, isPending, error };
};


export default function MainContent({ toggleSidebar }: MainContentProps) {
  const session = useSession();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const user = session.data?.user;
  const { recommendations, isPending, error } = useGetRecommendations();
  return (
    <div className="flex-1 flex flex-col bg-gray-50 w-full">
      <Header toggleSidebar={toggleSidebar} user={user} />
      <HeroSection />
      <ContentTabs />

      <h2 className="text-xl font-bold mt-5 mb-3 mx-5">
        {t("home:main_content.continue_program")}
      </h2>
      <ProgramCard
        imageUrl="https://picsum.photos/80/80?random=1"
        title="良い夢を"
        subtitle="夢見心地で"
        progress="2/7"
        progressPercent="28%"
        tagIcon="🎵"
        tagLabel="プログラム"
      />

      <h2 className="text-xl font-bold mt-5 mb-3 mx-5">{t("home:main_content.today_recommendation")}</h2>
      <div className="mx-5">
        <div className="text-sm text-gray-500 mb-4">6月10日 土曜日</div>
        {!isPending && !error && recommendations.map((rec, index) => (
          <RecommendationCard key={index} {...rec} />
        ))}
      </div>
    </div>
  );
}
