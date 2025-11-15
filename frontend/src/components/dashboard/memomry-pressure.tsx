import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Cpu } from "lucide-react";

interface MemoryPressureProps {
  usage: number;
}

export default function MemoryPressure({ usage }: MemoryPressureProps) {
  const roundedUsage = Math.round(usage);
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Cpu className="h-6 w-6" />
          <div>
            <CardTitle>Memory Pressure</CardTitle>
            <CardDescription>Real-time board memory usage.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col justify-center gap-4 pt-2">
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-4xl font-bold tracking-tighter">
            {roundedUsage}
          </span>
          <span className="text-lg font-medium text-muted-foreground">%</span>
        </div>
        <Progress value={roundedUsage} aria-label={`${roundedUsage}% memory used`} />
        <p className="text-center text-xs text-muted-foreground">
          SRAM usage overview
        </p>
      </CardContent>
    </Card>
  );
}
