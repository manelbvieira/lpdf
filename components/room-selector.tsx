"use client"

import { roomsData, type Room } from "@/lib/furniture-data"

interface RoomSelectorProps {
  currentRoom: Room
  onRoomChange: (room: Room) => void
}

export function RoomSelector({ currentRoom, onRoomChange }: RoomSelectorProps) {
  return (
    <nav className="flex flex-row lg:flex-col gap-1">
      {roomsData.map((room, index) => {
        const isActive = currentRoom.id === room.id

        return (
          <button
            key={room.id}
            onClick={() => onRoomChange(room)}
            className={`group flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-200 rounded-sm ${
              isActive
                ? "bg-[#0099CC]/8 text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <span className="text-[10px] tabular-nums text-muted-foreground font-light">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className={`text-sm tracking-wide ${isActive ? "font-medium" : "font-normal"}`}>
              {room.nome}
            </span>
            {isActive && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0099CC]" />
            )}
          </button>
        )
      })}
    </nav>
  )
}
