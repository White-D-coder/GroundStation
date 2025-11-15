import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, ArrowDown, ArrowUp } from "lucide-react";

interface SensorStatsProps {
  data: number[];
}

export default function SensorStats({ data }: SensorStatsProps) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const avg = data.reduce((acc, val) => acc + val, 0) / data.length;

  const stats = [
    {
      title: "Max Reading",
      value: max.toFixed(2),
      icon: <ArrowUp className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: "Min Reading",
      value: min.toFixed(2),
      icon: <ArrowDown className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: "Average",
      value: avg.toFixed(2),
      icon: <Activity className="h-5 w-5 text-muted-foreground" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              Based on last {data.length} readings
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
