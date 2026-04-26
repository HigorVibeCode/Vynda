import { create } from "zustand";

import { MAX_CONNECTIONS } from "../data/connection-presets";
import type { Connection, ConnectionGoal, ConnectionGoalStatus } from "../types/domain";

type GameState = {
  connections: Connection[];
  brainFlashConnectionId: string | null;
  addConnection: (input: { name: string; color: string; icon?: string }) => boolean;
  removeConnection: (id: string) => void;
  addGoal: (connectionId: string, input: { title: string; description?: string }) => void;
  setGoalStatus: (connectionId: string, goalId: string, status: ConnectionGoalStatus) => void;
  getConnectionById: (id: string) => Connection | undefined;
};

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useGameStore = create<GameState>((set, get) => ({
  connections: [],
  brainFlashConnectionId: null,

  getConnectionById: (id) => get().connections.find((c) => c.id === id),

  addConnection: ({ name, color, icon }) => {
    const trimmed = name.trim();
    if (!trimmed) {
      return false;
    }
    if (get().connections.length >= MAX_CONNECTIONS) {
      return false;
    }
    const connection: Connection = {
      id: newId("conn"),
      name: trimmed,
      color,
      icon: icon?.trim() || undefined,
      goals: [],
    };
    set((state) => ({ connections: [...state.connections, connection] }));
    return true;
  },

  removeConnection: (id) =>
    set((state) => ({
      connections: state.connections.filter((c) => c.id !== id),
      brainFlashConnectionId: state.brainFlashConnectionId === id ? null : state.brainFlashConnectionId,
    })),

  addGoal: (connectionId, { title, description }) => {
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }
    const goal: ConnectionGoal = {
      id: newId("goal"),
      title: trimmed,
      description: description?.trim() || undefined,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      connections: state.connections.map((c) =>
        c.id === connectionId ? { ...c, goals: [...c.goals, goal] } : c
      ),
    }));
  },

  setGoalStatus: (connectionId, goalId, status) =>
    set((state) => {
      let flash = false;
      const connections = state.connections.map((c) => {
        if (c.id !== connectionId) {
          return c;
        }
        const goals = c.goals.map((g) => {
          if (g.id === goalId && g.status !== "completed" && status === "completed") {
            flash = true;
          }
          if (g.id === goalId) {
            return { ...g, status };
          }
          return g;
        });
        return { ...c, goals };
      });
      return {
        connections,
        brainFlashConnectionId: flash ? connectionId : state.brainFlashConnectionId,
      };
    }),
}));
