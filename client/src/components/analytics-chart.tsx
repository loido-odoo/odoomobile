import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, BarChart, Bar, PieChart, Pie, Cell
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import type { Notification } from "@shared/schema";
import { useState } from "react";
import { addDays, format, subDays } from "date-fns";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85 p-3 rounded-lg shadow-lg border">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} className="text-sm">
            <span className="inline-block w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: entry.color }}/>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function AnalyticsChart() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const { data: notifications, isLoading } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"]
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading analytics...</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="animate-pulse bg-muted rounded w-full h-full" />
        </CardContent>
      </Card>
    );
  }

  // Filter notifications by date range
  const filteredNotifications = notifications?.filter(n => {
    const date = new Date(n.timestamp ?? Date.now());
    return date >= dateRange.from && date <= dateRange.to;
  });

  // Group notifications by date and count metrics
  const aggregatedData = filteredNotifications?.reduce((acc, n) => {
    const date = format(new Date(n.timestamp ?? Date.now()), 'MMM dd');
    if (!acc[date]) {
      acc[date] = { date, total: 0, delivered: 0, clicked: 0 };
    }
    acc[date].total += 1;
    if (n.delivered) acc[date].delivered += 1;
    if (n.clicked) acc[date].clicked += 1;
    return acc;
  }, {} as Record<string, any>);

  const data = Object.values(aggregatedData ?? []);

  // Calculate overall statistics
  const stats = {
    total: filteredNotifications?.length ?? 0,
    delivered: filteredNotifications?.filter(n => n.delivered).length ?? 0,
    clicked: filteredNotifications?.filter(n => n.clicked).length ?? 0
  };

  const pieData = [
    { name: 'Undelivered', value: stats.total - stats.delivered },
    { name: 'Delivered (No Click)', value: stats.delivered - stats.clicked },
    { name: 'Clicked', value: stats.clicked }
  ];

  const downloadReport = () => {
    const csvContent = [
      ['Date', 'Total', 'Delivered', 'Clicked'].join(','),
      ...data.map(row => [row.date, row.total, row.delivered, row.clicked].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notification-analytics-${format(dateRange.from, 'yyyy-MM-dd')}-to-${format(dateRange.to, 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <Card className="transition-all duration-200 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Notification Analytics</CardTitle>
          <div className="flex items-center gap-4">
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            <Button variant="outline" size="icon" onClick={downloadReport}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.delivered}</p>
              <p className="text-sm text-muted-foreground">Delivered</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.clicked}</p>
              <p className="text-sm text-muted-foreground">Clicked</p>
            </div>
          </div>

          <div className="h-[300px] mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="deliveredGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="clickedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Total"
                  stroke="hsl(var(--primary))"
                  fill="url(#totalGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="delivered"
                  name="Delivered"
                  stroke="hsl(var(--accent))"
                  fill="url(#deliveredGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="clicked"
                  name="Clicked"
                  stroke="hsl(var(--secondary))"
                  fill="url(#clickedGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-[300px]">
              <h3 className="text-lg font-semibold mb-4">Daily Distribution</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="total" fill="hsl(var(--primary))" name="Total" />
                  <Bar dataKey="delivered" fill="hsl(var(--accent))" name="Delivered" />
                  <Bar dataKey="clicked" fill="hsl(var(--secondary))" name="Clicked" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="h-[300px]">
              <h3 className="text-lg font-semibold mb-4">Engagement Overview</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}