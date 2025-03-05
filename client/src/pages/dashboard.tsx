import { NotificationOptIn } from "@/components/notification-opt-in";
import { AnalyticsChart } from "@/components/analytics-chart";

export default function Dashboard() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">CRM Notification Dashboard</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <NotificationOptIn />
        </div>
        <div>
          <AnalyticsChart />
        </div>
      </div>
    </div>
  );
}
