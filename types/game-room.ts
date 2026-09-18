export type GameRoom = {
  id: string;
  name: string;
  region: "EU" | "US" | "ASIA";
  players: number;
  maxPlayers: number;
  status: "online" | "offline";
};