"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

interface Habit {
  id: string;
  name: string;
  calendar_entries: Record<string, { image: string; status: "success" | "failed" }>;
}

interface Statistics {
  weekly: { success: number; failed: number };
  monthly: { success: number; failed: number };
  annually: { success: number; failed: number };
}

export default function HabitTracker({ habits, text }: { habits: Habit[]; text: string }) {
  const calculateStatistics = (habit: Habit): Statistics => {
    const entries = habit.calendar_entries || {};
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

    const calculatePeriodStats = (startDate: Date) => {
      return Object.entries(entries).reduce(
        (acc, [date, entry]) => {
          try {
            const entryDate = new Date(date);
            if (!isNaN(entryDate.getTime()) && entryDate >= startDate) {
              if (entry.status === "success") acc.success++;
              else if (entry.status === "failed") acc.failed++;
            }
          } catch (error) {
            console.error(error, date);
          }
          return acc;
        },
        { success: 0, failed: 0 } as { success: number; failed: number } // ✅ Ensure the accumulator has correct types
      );
    };

    return {
      weekly: calculatePeriodStats(oneWeekAgo),
      monthly: calculatePeriodStats(oneMonthAgo),
      annually: calculatePeriodStats(oneYearAgo),
    };
  };

  if (!habits.length) {
    return <div className="flex justify-center items-center min-h-[200px]">No habits tracked yet.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-muted rounded-lg">🥊</div>
            {text}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {habits.map((habit) => {
            const stats = calculateStatistics(habit);
            return (
              <Card key={habit.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-semibold">{habit.name}</h3>
                      <div className="flex items-center gap-2 text-sm">
                        {stats.weekly.success > stats.weekly.failed ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4" />
                            You're doing great!
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center gap-1">
                            <XCircle className="h-4 w-4" />
                            You need to improve!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Weekly:</span>{" "}
                    <span className="font-mono text-green-600">{stats.weekly.success}</span> /{" "}
                    <span className="font-mono text-red-600">{stats.weekly.failed}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Monthly:</span>{" "}
                    <span className="font-mono text-green-600">{stats.monthly.success}</span> /{" "}
                    <span className="font-mono text-red-600">{stats.monthly.failed}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Annually:</span>{" "}
                    <span className="font-mono text-green-600">{stats.annually.success}</span> /{" "}
                    <span className="font-mono text-red-600">{stats.annually.failed}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
