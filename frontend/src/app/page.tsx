"use client";

import * as React from "react";
import Header from "@/components/header";
import CodeViewer from "@/components/dashboard/code-viewer";
import MemoryPressure from "@/components/dashboard/memory-pressure";
import RealtimeDataChart from "@/components/dashboard/realtime-data-chart";
import SensorStats from "@/components/dashboard/sensor-stats";

const DATA_POINTS_COUNT = 30;

export default function DashboardPage() {
  const [sensorData] = React.useState<number[]>(() =>
    Array(DATA_POINTS_COUNT)
      .fill(0)
      .map(() => Math.random() * 50 + 25)
  );
  const [memoryUsage] = React.useState(35);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 bg-background p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RealtimeDataChart data={sensorData} />
          </div>
          <div className="lg:col-span-1">
            <MemoryPressure usage={memoryUsage} />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <SensorStats data={sensorData} />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <CodeViewer />
          </div>
        </div>
      </main>
    </div>
  );
}
