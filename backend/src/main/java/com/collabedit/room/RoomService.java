package com.collabedit.room;

import com.collabedit.file.CodeFile;
import com.collabedit.file.CodeFileRepository;
import com.collabedit.room.dto.CreateRoomRequest;
import com.collabedit.room.dto.RoomResponse;
import com.collabedit.user.User;
import com.collabedit.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public Room findByInviteCode(UUID inviteCode) {
        return roomRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }

    private RoomResponse toResponse(Room room) {
        return RoomResponse.builder()
                .id(room.getId())
                .name(room.getName())
                .inviteCode(room.getInviteCode().toString())
                .ownerUsername(room.getOwner().getUsername())
                .memberCount(room.getMembers().size() + 1)
                .createdAt(room.getCreatedAt())
                .build();
    }
}
