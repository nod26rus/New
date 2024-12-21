"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Habit {
  id: string;
  name: string;
  description: string | null;
  streakCount: number;
  lastChecked: string | null;
}

export function HabitList() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHabits();
  }, []);

  async function fetchHabits() {
    try {
      const response = await fetch("/api/habits");
      if (!response.ok) throw new Error();
      const data = await response.json();
      setHabits(data);
    } catch (error) {
      toast.error("Failed to load habits");
    } finally {
      setLoading(false);
    }
  }

  async function checkHabit(id: string) {
    try {
      const response = await fetch(`/api/habits/${id}/check`, {
        method: "POST"
      });
      if (!response.ok) throw new Error();
      
      const updatedHabit = await response.json();
      setHabits(habits.map(h => 
        h.id === id ? updatedHabit : h
      ));
      
      toast.success("Habit checked!");
    } catch (error) {
      toast.error("Failed to check habit");
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Habit</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Streak</TableHead>
            <TableHead>Last Checked</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {habits.map((habit) => (
            <TableRow key={habit.id}>
              <TableCell className="font-medium">{habit.name}</TableCell>
              <TableCell>{habit.description}</TableCell>
              <TableCell>{habit.streakCount} days</TableCell>
              <TableCell>
                {habit.lastChecked 
                  ? format(new Date(habit.lastChecked), "PPP")
                  : "Never"
                }
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => checkHabit(habit.id)}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}