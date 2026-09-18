import type { GameRoom } from "@/types/game-room";

export const rooms: GameRoom[] = [
  {
    id: "1",
    name: "Alpha Arena",
    region: "EU",
    players: 4,
    maxPlayers: 8,
    status: "online",
  },
  {
    id: "2",
    name: "Night Raid",
    region: "US",
    players: 8,
    maxPlayers: 8,
    status: "online",
  },
  {
    id: "3",
    name: "Tokyo Rush",
    region: "ASIA",
    players: 2,
    maxPlayers: 6,
    status: "offline",
  },
  {
    id: "4",
    name: "Red Zone",
    region: "EU",
    players: 5,
    maxPlayers: 10,
    status: "online",
  },
  {
    id: "5",
    name: "Last Stand",
    region: "US",
    players: 1,
    maxPlayers: 4,
    status: "online",
  },
  {
    id: "6",
    name: "Dragon Gate",
    region: "ASIA",
    players: 6,
    maxPlayers: 6,
    status: "online",
  },
];