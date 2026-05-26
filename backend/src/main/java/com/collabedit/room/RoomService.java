package com.collabedit.room;

import com.collabedit.file.CodeFile;
import com.collabedit.file.CodeFileRepository;
import com.collabedit.room.dto.CreateRoomRequest;
import com.collabedit.room.dto.RoomResponse;
import com.collabedit.user.User;
import com.collabedit.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final CodeFileRepository codeFileRepository;

    public RoomService(RoomRepository roomRepository, UserRepository userRepository,
                       CodeFileRepository codeFileRepository) {
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.codeFileRepository = codeFileRepository;
    }

    @Transactional
    public RoomResponse createRoom(CreateRoomRequest request, String username) {
        User owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Room room = Room.builder()
                .name(request.getName())
                .owner(owner)
                .build();
        room = roomRepository.save(room);

        CodeFile defaultFile = CodeFile.builder()
                .room(room)
                .filename("Main.java")
                .content("public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, CollabWrite!\");\n    }\n}\n")
                .build();
        codeFileRepository.save(defaultFile);

        return toResponse(room);
    }

    public List<RoomResponse> getUserRooms(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return roomRepository.findAllByUserId(user.getId()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public RoomResponse getRoomByInviteCode(UUID inviteCode) {
        Room room = roomRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        return toResponse(room);
    }

    @Transactional
    public RoomResponse joinRoom(UUID inviteCode, String username) {
        Room room = roomRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        room.getMembers().add(user);
        roomRepository.save(room);
        return toResponse(room);
    }

    /**
     * Delete a room. Only the owner is allowed to delete.
     * Because Room has cascade = ALL + orphanRemoval on files,
     * and we clear members before deleting, this handles FK constraints.
     */
    @Transactional
    public void deleteRoom(Long roomId, String username) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found"));

        if (!room.getOwner().getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the room owner can delete this room");
        }

        // Clear the join table entries first to avoid FK constraint issues
        room.getMembers().clear();
        roomRepository.save(room);

        // Now delete the room (cascades to code_files due to CascadeType.ALL + orphanRemoval)
        roomRepository.delete(room);
    }

    /**
     * Leave a room. Removes the user from the members set.
     * The owner cannot leave — they must delete the room instead.
     */
    @Transactional
    public void leaveRoom(Long roomId, String username) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (room.getOwner().getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Room owner cannot leave. Delete the room instead.");
        }

        room.getMembers().remove(user);
        roomRepository.save(room);
    }

    public Room findByInviteCode(UUID inviteCode) {
        return roomRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }

    private RoomResponse toResponse(Room room) {
        return RoomResponse.builder()
                .id(room.getId())
                .name(room.getName())
                .inviteCode(room.getInviteCode().toString())
                .ownerId(room.getOwner().getId())
                .ownerUsername(room.getOwner().getUsername())
                .memberCount(room.getMembers().size() + 1)
                .createdAt(room.getCreatedAt())
                .build();
    }
}
