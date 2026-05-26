package com.collabedit.websocket;

import org.springframework.web.socket.WebSocketSession;

public class UserSession {
    private WebSocketSession session;
    private String username;
    private String roomId;
    private String color;
    private String currentFileId;
    private int cursorLine;
    private int cursorColumn;

    public UserSession() {}

    public UserSession(WebSocketSession session, String username, String roomId, String color, String currentFileId, int cursorLine, int cursorColumn) {
        this.session = session;
        this.username = username;
        this.roomId = roomId;
        this.color = color;
        this.currentFileId = currentFileId;
        this.cursorLine = cursorLine;
        this.cursorColumn = cursorColumn;
    }

    public WebSocketSession getSession() { return session; }
    public void setSession(WebSocketSession session) { this.session = session; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public String getCurrentFileId() { return currentFileId; }
    public void setCurrentFileId(String currentFileId) { this.currentFileId = currentFileId; }
    public int getCursorLine() { return cursorLine; }
    public void setCursorLine(int cursorLine) { this.cursorLine = cursorLine; }
    public int getCursorColumn() { return cursorColumn; }
    public void setCursorColumn(int cursorColumn) { this.cursorColumn = cursorColumn; }
}
