import ChannelHero from "@/app/components/channel/channelHero";
import ChannelPreview from "@/app/components/channel/channelPreview";
import ChannelRubrics from "@/app/components/channel/channelRubrics";
import ChannelStats from "@/app/components/channel/channelStats";
import SubscribeCTA from "@/app/components/channel/subscribeCTA";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Telegram-канал репетитора по химии | Химия: путь к вершине",
  description:
    "Подпишись на канал с полезными материалами по химии: разбор задач, теория, лайфхаки для ЕГЭ и ОГЭ",
};

export default function TelegramChannelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-500 to-white">
      <ChannelHero />
      <ChannelStats />
      <ChannelRubrics />
      <ChannelPreview />
      <SubscribeCTA />
    </div>
  );
}
