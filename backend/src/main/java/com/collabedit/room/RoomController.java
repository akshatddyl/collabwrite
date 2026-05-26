package com.collabedit.room;

import com.collabedit.room.dto.CreateRoomRequest;
import com.collabedit.room.dto.RoomResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping
    public ResponseEntity<RoomResponse> createRoom(
            @Valid @RequestBody CreateRoomRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(roomService.createRoom(request, userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<RoomResponse>> getUserRooms(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(roomService.getUserRooms(userDetails.getUsername()));
    }

    @GetMapping("/invite/{inviteCode}")
    public ResponseEntity<RoomResponse> getRoomByInviteCode(@PathVariable UUID inviteCode) {
        return ResponseEntity.ok(roomService.getRoomByInviteCode(inviteCode));
    }

    @PostMapping("/join/{inviteCode}")
    public ResponseEntity<RoomResponse> joinRoom(
            @PathVariable UUID inviteCode,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(roomService.joinRoom(inviteCode, userDetails.getUsername()));
    }
}
