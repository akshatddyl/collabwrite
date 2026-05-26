package com.collabedit.websocket.message;

import java.util.List;
import java.util.Map;

public class OutgoingMessage {
    private String type;
    private String roomId;
    private String fileId;
    private String username;
    private String content;
    private Integer lineNumber;
    private Integer column;
    private String color;
    private String filename;
    private List<Map<String, Object>> users;
    private List<Map<String, Object>> files;

    public OutgoingMessage() {}

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }
    public String getFileId() { return fileId; }
    public void setFileId(String fileId) { this.fileId = fileId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Integer getLineNumber() { return lineNumber; }
    public void setLineNumber(Integer lineNumber) { this.lineNumber = lineNumber; }
    public Integer getColumn() { return column; }
    public void setColumn(Integer column) { this.column = column; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }
    public List<Map<String, Object>> getUsers() { return users; }
    public void setUsers(List<Map<String, Object>> users) { this.users = users; }
    public List<Map<String, Object>> getFiles() { return files; }
    public void setFiles(List<Map<String, Object>> files) { this.files = files; }

    public static OutgoingMessageBuilder builder() { return new OutgoingMessageBuilder(); }

    public static class OutgoingMessageBuilder {
        private String type;
        private String roomId;
        private String fileId;
        private String username;
        private String content;
        private Integer lineNumber;
        private Integer column;
        private String color;
        private String filename;
        private List<Map<String, Object>> users;
        private List<Map<String, Object>> files;

        public OutgoingMessageBuilder type(String type) { this.type = type; return this; }
        public OutgoingMessageBuilder roomId(String roomId) { this.roomId = roomId; return this; }
        public OutgoingMessageBuilder fileId(String fileId) { this.fileId = fileId; return this; }
        public OutgoingMessageBuilder username(String username) { this.username = username; return this; }
        public OutgoingMessageBuilder content(String content) { this.content = content; return this; }
        public OutgoingMessageBuilder lineNumber(Integer lineNumber) { this.lineNumber = lineNumber; return this; }
        public OutgoingMessageBuilder column(Integer column) { this.column = column; return this; }
        public OutgoingMessageBuilder color(String color) { this.color = color; return this; }
        public OutgoingMessageBuilder filename(String filename) { this.filename = filename; return this; }
        public OutgoingMessageBuilder users(List<Map<String, Object>> users) { this.users = users; return this; }
        public OutgoingMessageBuilder files(List<Map<String, Object>> files) { this.files = files; return this; }

        public OutgoingMessage build() {
            OutgoingMessage msg = new OutgoingMessage();
            msg.type = this.type;
            msg.roomId = this.roomId;
            msg.fileId = this.fileId;
            msg.username = this.username;
            msg.content = this.content;
            msg.lineNumber = this.lineNumber;
            msg.column = this.column;
            msg.color = this.color;
            msg.filename = this.filename;
            msg.users = this.users;
            msg.files = this.files;
            return msg;
        }
    }
}
