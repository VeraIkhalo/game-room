"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.scss";
import type { GameRoom } from "@/types/game-room";

type StatusFilter = "all" | "online" | "offline";

export default function Home() {
  const [rooms, setRooms] = useState<GameRoom[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [joiningRoomId, setJoiningRoomId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    async function loadRooms() {
      try {
        const response = await fetch("/api/rooms");

        if (!response.ok) {
          throw new Error("Unable to load rooms");
        }

        const data: GameRoom[] = await response.json();
        setRooms(data);
      } catch {
        setError("Could not load rooms. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadRooms();
  }, []);

  const filteredRooms = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return rooms.filter((room) => {
      const matchesSearch = room.name
        .toLowerCase()
        .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" || room.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rooms, search, statusFilter]);

  async function joinRoom(roomId: string) {
    setJoiningRoomId(roomId);

    try {
      const response = await fetch(`/api/rooms/${roomId}/join`, {
        method: "POST",
      });

      if (!response.ok) {
        const data: { message?: string } = await response.json();
        throw new Error(data.message ?? "Unable to join room");
      }

      const updatedRoom: GameRoom = await response.json();

      setRooms((currentRooms) =>
        currentRooms.map((room) =>
          room.id === updatedRoom.id ? updatedRoom : room,
        ),
      );
    } catch (joinError) {
      const message =
        joinError instanceof Error
          ? joinError.message
          : "Unable to join room";

      window.alert(message);
    } finally {
      setJoiningRoomId(null);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>MATCHMAKING HUB</p>
          <h1>Game Rooms</h1>
          <p>Find an active room and jump into the action.</p>
        </header>

        <section className={styles.toolbar} aria-label="Room filters">
          <label className={styles.searchLabel}>
            <span className={styles.visuallyHidden}>Search rooms</span>
            <input
              type="search"
              placeholder="Search rooms..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <div className={styles.filters}>
            {(["all", "online", "offline"] as StatusFilter[]).map(
              (filter) => (
                <button
                  key={filter}
                  type="button"
                  className={
                    statusFilter === filter
                      ? styles.activeFilter
                      : styles.filter
                  }
                  onClick={() => setStatusFilter(filter)}
                  aria-pressed={statusFilter === filter}
                >
                  {filter[0].toUpperCase() + filter.slice(1)}
                </button>
              ),
            )}
          </div>
        </section>

        {isLoading && (
          <p className={styles.message} role="status">
            Loading rooms...
          </p>
        )}

        {!isLoading && error && (
          <p className={styles.message} role="alert">
            {error}
          </p>
        )}

        {!isLoading && !error && filteredRooms.length === 0 && (
          <p className={styles.message}>
            No rooms match your search and filter.
          </p>
        )}

        {!isLoading && !error && filteredRooms.length > 0 && (
          <section className={styles.grid} aria-label="Available rooms">
            {filteredRooms.map((room) => {
              const isFull = room.players >= room.maxPlayers;
              const isJoining = joiningRoomId === room.id;
              const isDisabled =
                isFull || room.status === "offline" || isJoining;

              return (
                <article className={styles.card} key={room.id}>
                  <div className={styles.cardHeader}>
                    <div>
                      <p className={styles.region}>{room.region}</p>
                      <h2>{room.name}</h2>
                    </div>

                    <span
                      className={`${styles.status} ${
                        room.status === "online"
                          ? styles.online
                          : styles.offline
                      }`}
                    >
                      {room.status}
                    </span>
                  </div>

                  <div className={styles.capacity}>
                    <span>Players</span>
                    <strong>
                      {room.players} / {room.maxPlayers}
                    </strong>
                  </div>

                  <div className={styles.capacityBar}>
                    <span
                      style={{
                        width: `${(room.players / room.maxPlayers) * 100}%`,
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    className={styles.joinButton}
                    disabled={isDisabled}
                    onClick={() => joinRoom(room.id)}
                  >
                    {isJoining
                      ? "Joining..."
                      : isFull
                        ? "Full"
                        : room.status === "offline"
                          ? "Offline"
                          : "Join"}
                  </button>
                </article>
              );
            })}
          </section>
        )}
      </section>
    </main>
  );
}