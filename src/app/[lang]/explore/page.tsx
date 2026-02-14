"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExploreTemplate } from "@/components/templates/ExploreTemplate";
import { ExploreHeader } from "@/components/organisms/ExploreHeader";
import { ContentGrid } from "@/components/organisms/ContentGrid";
import { FeaturedContent } from "@/components/organisms/FeaturedContent";
import { ContentCardData } from "@/components/molecules/ContentCard";
import { Category } from "@/components/molecules/CategoryTabList";
import { Pagination } from "@/components/atoms/Pagination";
import { useTranslation, useLanguage } from "@/i18n/client";

// 1ページあたりの表示件数
const ITEMS_PER_PAGE = 6;

// カテゴリーIDリスト
const categoryIds = [
  "all",
  "sleep",
  "stress",
  "focus",
  "morning",
  "relaxation",
  "breathing",
  "mindfulness",
] as const;

// サンプル瞑想コンテンツデータ
const sampleContents: ContentCardData[] = [
  {
    id: "1",
    title: "深い眠りへの誘導瞑想",
    description: "ストレスを解消し、深い眠りへと導く20分間の瞑想セッション",
    imageUrl: "/images/meditation/sleep.jpg",
    duration: "20分",
    category: "sleep",
    isPopular: true,
  },
  {
    id: "2",
    title: "朝の目覚めの瞑想",
    description: "一日のスタートをポジティブに。エネルギーを高める朝の瞑想",
    imageUrl: "/images/meditation/morning.jpg",
    duration: "10分",
    category: "morning",
    isNew: true,
  },
  {
    id: "3",
    title: "ストレス解消ブリージング",
    description: "忙しい日々のストレスを解消する簡単な呼吸法",
    imageUrl: "/images/meditation/breathing.jpg",
    duration: "5分",
    category: "breathing",
  },
  {
    id: "4",
    title: "集中力アップ瞑想",
    description: "仕事や勉強の前に。集中力を高めるマインドフルネス瞑想",
    imageUrl: "/images/meditation/focus.jpg",
    duration: "15分",
    category: "focus",
    isPopular: true,
  },
  {
    id: "5",
    title: "ボディスキャン瞑想",
    description: "全身をリラックスさせるボディスキャン瞑想セッション",
    imageUrl: "/images/meditation/bodyscan.jpg",
    duration: "25分",
    category: "relaxation",
  },
  {
    id: "6",
    title: "感謝の瞑想",
    description: "日々の小さな幸せに気づく感謝のマインドフルネス",
    imageUrl: "/images/meditation/gratitude.jpg",
    duration: "12分",
    category: "mindfulness",
    isNew: true,
  },
  {
    id: "7",
    title: "不安を和らげる瞑想",
    description: "心配事や不安を手放すためのガイド付き瞑想",
    imageUrl: "/images/meditation/anxiety.jpg",
    duration: "18分",
    category: "stress",
  },
  {
    id: "8",
    title: "4-7-8呼吸法",
    description: "リラックスと睡眠に効果的な4-7-8呼吸テクニック",
    imageUrl: "/images/meditation/478breathing.jpg",
    duration: "8分",
    category: "breathing",
  },
  {
    id: "9",
    title: "昼休みのリフレッシュ瞑想",
    description: "午後のパフォーマンスを上げる短時間リフレッシュ",
    imageUrl: "/images/meditation/lunch.jpg",
    duration: "7分",
    category: "relaxation",
  },
  {
    id: "10",
    title: "夜のリラックス瞑想",
    description: "一日の疲れを癒す夜のリラクゼーション",
    imageUrl: "/images/meditation/night.jpg",
    duration: "15分",
    category: "sleep",
  },
  {
    id: "11",
    title: "歩く瞑想",
    description: "日常の散歩をマインドフルな時間に変える",
    imageUrl: "/images/meditation/walking.jpg",
    duration: "20分",
    category: "mindfulness",
  },
  {
    id: "12",
    title: "仕事前の集中準備",
    description: "重要なミーティングや作業前の集中力強化",
    imageUrl: "/images/meditation/work.jpg",
    duration: "5分",
    category: "focus",
    isNew: true,
  },
  {
    id: "13",
    title: "自己肯定感を高める瞑想",
    description: "自分を愛し、受け入れるためのセルフケア瞑想",
    imageUrl: "/images/meditation/self-love.jpg",
    duration: "15分",
    category: "mindfulness",
    isPopular: true,
  },
  {
    id: "14",
    title: "怒りを鎮める瞑想",
    description: "感情をコントロールし、心を落ち着かせる",
    imageUrl: "/images/meditation/anger.jpg",
    duration: "10分",
    category: "stress",
  },
  {
    id: "15",
    title: "週末のディープリラックス",
    description: "休日にぴったりの深いリラクゼーション体験",
    imageUrl: "/images/meditation/weekend.jpg",
    duration: "30分",
    category: "relaxation",
  },
];

// おすすめコンテンツ
const featuredContent: ContentCardData = {
  id: "featured",
  title: "初めての方へ：7日間マインドフルネス入門",
  description:
    "瞑想が初めての方に最適。毎日10分、7日間で基礎をマスター。習慣化への第一歩を踏み出しましょう。",
  imageUrl: "/images/meditation/featured.jpg",
  duration: "7日間プログラム",
  category: "mindfulness",
};

type PageProps = {
  params: { lang: string };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ExplorePage(_props: PageProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  // 翻訳されたカテゴリーリスト
  const categories: Category[] = useMemo(() => {
    return categoryIds.map((id) => ({
      id,
      label: t(`explore:categories.${id}`),
    }));
  }, [t]);

  // フィルタリングされたコンテンツ
  const filteredContents = useMemo(() => {
    return sampleContents
      .map((content) => ({
        ...content,
        isFavorite: favorites.has(content.id),
      }))
      .filter((content) => {
        // カテゴリーフィルター
        if (activeCategory !== "all") {
          if (content.category !== activeCategory) {
            return false;
          }
        }

        // 検索フィルター
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            content.title.toLowerCase().includes(query) ||
            content.description.toLowerCase().includes(query) ||
            content.category.toLowerCase().includes(query)
          );
        }

        return true;
      });
  }, [activeCategory, searchQuery, favorites]);

  // ページネーション計算
  const totalPages = Math.ceil(filteredContents.length / ITEMS_PER_PAGE);
  const paginatedContents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredContents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredContents, currentPage]);

  // フィルター変更時にページをリセット
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  // ページ変更ハンドラ
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // コンテンツクリック時の処理
  const handleContentClick = (content: ContentCardData) => {
    router.push(`/${language}/meditation?id=${content.id}`);
  };

  // お気に入りトグル
  const handleFavoriteClick = (content: ContentCardData) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(content.id)) {
        newFavorites.delete(content.id);
      } else {
        newFavorites.add(content.id);
      }
      return newFavorites;
    });
  };

  // おすすめコンテンツクリック
  const handleFeaturedClick = () => {
    router.push(`/${language}/meditation?id=${featuredContent.id}`);
  };

  // 件数表示の計算
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(
    currentPage * ITEMS_PER_PAGE,
    filteredContents.length,
  );

  return (
    <ExploreTemplate>
      {/* おすすめセクション */}
      <FeaturedContent
        content={featuredContent}
        onClick={handleFeaturedClick}
        featuredLabel={t("explore:featured")}
        startButtonLabel={t("explore:start_now")}
      />

      {/* 検索・フィルターヘッダー */}
      <ExploreHeader
        title={t("explore:title")}
        subtitle={t("explore:subtitle")}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={t("explore:search_placeholder")}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* 件数表示 */}
      {filteredContents.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {t("explore:showing_results", {
              total: filteredContents.length,
              start: startItem,
              end: endItem,
            })}
          </p>
        </div>
      )}

      {/* コンテンツグリッド */}
      <ContentGrid
        contents={paginatedContents}
        onContentClick={handleContentClick}
        onFavoriteClick={handleFavoriteClick}
        emptyMessage={t("explore:empty_message")}
        newBadgeLabel={t("explore:badges.new")}
        popularBadgeLabel={t("explore:badges.popular")}
      />

      {/* ページネーション */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className="mt-8"
      />
    </ExploreTemplate>
  );
}
