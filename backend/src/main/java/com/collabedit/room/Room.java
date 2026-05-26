package com.collabedit.room;

import com.collabedit.user.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "invite_code", nullable = false, unique = true)
    private UUID inviteCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "room_members",
        joinColumns = @JoinColumn(name = "room_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> members = new HashSet<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Room() {}

    public Room(Long id, String name, UUID inviteCode, User owner, Set<User> members, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.inviteCode = inviteCode;
        this.owner = owner;
        this.members = members != null ? members : new HashSet<>();
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        if (inviteCode == null) inviteCode = UUID.randomUUID();
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public UUID getInviteCode() { return inviteCode; }
    public void setInviteCode(UUID inviteCode) { this.inviteCode = inviteCode; }
    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
    public Set<User> getMembers() { return members; }
    public void setMembers(Set<User> members) { this.members = members; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static RoomBuilder builder() { return new RoomBuilder(); }

    public static class RoomBuilder {
        private Long id;
        private String name;
        private UUID inviteCode;
        private User owner;
        private Set<User> members = new HashSet<>();
        private LocalDateTime createdAt;

        public RoomBuilder id(Long id) { this.id = id; return this; }
        public RoomBuilder name(String name) { this.name = name; return this; }
        public RoomBuilder inviteCode(UUID inviteCode) { this.inviteCode = inviteCode; return this; }
        public RoomBuilder owner(User owner) { this.owner = owner; return this; }
        public RoomBuilder members(Set<User> members) { this.members = members; return this; }
        public RoomBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Room build() {
            return new Room(id, name, inviteCode, owner, members, createdAt);
        }
    }
}
