package com.collabedit.room.dto;

import java.time.LocalDateTime;

public class RoomResponse {
    private Long id;
    private String name;
    private String inviteCode;
    private String ownerUsername;
    private int memberCount;
    private LocalDateTime createdAt;

    public RoomResponse() {}

    public RoomResponse(Long id, String name, String inviteCode, String ownerUsername, int memberCount, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.inviteCode = inviteCode;
        this.ownerUsername = ownerUsername;
        this.memberCount = memberCount;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getInviteCode() { return inviteCode; }
    public void setInviteCode(String inviteCode) { this.inviteCode = inviteCode; }
    public String getOwnerUsername() { return ownerUsername; }
    public void setOwnerUsername(String ownerUsername) { this.ownerUsername = ownerUsername; }
    public int getMemberCount() { return memberCount; }
    public void setMemberCount(int memberCount) { this.memberCount = memberCount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static RoomResponseBuilder builder() { return new RoomResponseBuilder(); }

    public static class RoomResponseBuilder {
        private Long id;
        private String name;
        private String inviteCode;
        private String ownerUsername;
        private int memberCount;
        private LocalDateTime createdAt;

        public RoomResponseBuilder id(Long id) { this.id = id; return this; }
        public RoomResponseBuilder name(String name) { this.name = name; return this; }
        public RoomResponseBuilder inviteCode(String inviteCode) { this.inviteCode = inviteCode; return this; }
        public RoomResponseBuilder ownerUsername(String ownerUsername) { this.ownerUsername = ownerUsername; return this; }
        public RoomResponseBuilder memberCount(int memberCount) { this.memberCount = memberCount; return this; }
        public RoomResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public RoomResponse build() {
            return new RoomResponse(id, name, inviteCode, ownerUsername, memberCount, createdAt);
        }
    }
}
