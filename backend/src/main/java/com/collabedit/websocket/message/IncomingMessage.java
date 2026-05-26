package com.collabedit.websocket.message;

public class IncomingMessage {
    private String type;
    private String roomId;
    private String fileId;
    private String username;
    private String content;
    private Integer position;
    private Integer lineNumber;
    private Integer column;
    private String filename;
    private String color;

    public IncomingMessage() {}

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
    public Integer getPosition() { return position; }
    public void setPosition(Integer position) { this.position = position; }
    public Integer getLineNumber() { return lineNumber; }
    public void setLineNumber(Integer lineNumber) { this.lineNumber = lineNumber; }
    public Integer getColumn() { return column; }
    public void setColumn(Integer column) { this.column = column; }
    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}
