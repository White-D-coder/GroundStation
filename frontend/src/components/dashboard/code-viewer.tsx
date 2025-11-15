import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Code, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ARDUINO_CODE } from "@/lib/mock-data";

export default function CodeViewer() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <Code className="h-6 w-6" />
          <div>
            <CardTitle>Code Viewer</CardTitle>
            <CardDescription>Current sketch running on the board.</CardDescription>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(ARDUINO_CODE)}>
          <Copy className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md bg-primary/90 p-4 font-code text-sm text-primary-foreground shadow-inner">
          <pre className="overflow-x-auto">
            <code>{ARDUINO_CODE}</code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
