package com.collabedit.file;

import com.collabedit.room.Room;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "code_files")
public class CodeFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    @JsonIgnore
    private Room room;

    @Column(nullable = false, length = 255)
    private String filename;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public CodeFile() {}

    public CodeFile(Long id, Room room, String filename, String content, LocalDateTime updatedAt) {
        this.id = id;
        this.room = room;
        this.filename = filename;
        this.content = content;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Room getRoom() { return room; }
    public void setRoom(Room room) { this.room = room; }
    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static CodeFileBuilder builder() { return new CodeFileBuilder(); }

    public static class CodeFileBuilder {
        private Long id;
        private Room room;
        private String filename;
        private String content;
        private LocalDateTime updatedAt;

        public CodeFileBuilder id(Long id) { this.id = id; return this; }
        public CodeFileBuilder room(Room room) { this.room = room; return this; }
        public CodeFileBuilder filename(String filename) { this.filename = filename; return this; }
        public CodeFileBuilder content(String content) { this.content = content; return this; }
        public CodeFileBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public CodeFile build() {
            return new CodeFile(id, room, filename, content, updatedAt);
        }
    }
}
