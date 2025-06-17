'use client';

interface TabItemProps {
  icon: string;
  label: string;
}

function TabItem({ icon, label }: TabItemProps) {
  return (
    <div className="flex items-center py-1.5 px-3 sm:py-2 sm:px-4 bg-gray-100 rounded-full whitespace-nowrap text-xs sm:text-sm text-gray-600 cursor-pointer hover:bg-gray-200">
      <div className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-1.5 flex justify-center items-center">{icon}</div>
      <span>{label}</span>
    </div>
  );
}

const tabs = [
  { icon: '♡', label: 'お気に入り' },
  { icon: '✓', label: 'ムードチェック' },
  { icon: '🧘', label: '呼吸エクササイズ' },
  { icon: '🎵', label: 'くつろぎサウンド' },
  { icon: '💬', label: '今日の名言' },
  { icon: '📝', label: 'メモ' },
  { icon: '📊', label: 'ムードログ' },
  { icon: '🤖', label: 'Soul AI' },
];

export default function ContentTabs() {
  return (
    <div className="flex overflow-x-auto py-4 px-5 gap-2.5 bg-white">
      {tabs.map(tab => <TabItem key={tab.label} icon={tab.icon} label={tab.label} />)}
    </div>
  );
}