package com.collabedit.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SessionManager {

    // sessionId -> UserSession
    private final Map<String, UserSession> sessions = new ConcurrentHashMap<>();

    private static final String[] CURSOR_COLORS = {
        "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
        "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
        "#F1948A", "#82E0AA", "#F8C471", "#AED6F1", "#D7BDE2",
        "#A3E4D7", "#FAD7A0", "#A9CCE3", "#D5DBDB", "#EDBB99"
    };

    private int colorIndex = 0;

    public void addSession(WebSocketSession session, String username, String roomId) {
        String color = CURSOR_COLORS[colorIndex % CURSOR_COLORS.length];
        colorIndex++;
        sessions.put(session.getId(), new UserSession(session, username, roomId, color, null, 0, 0));
    }

    public void removeSession(String sessionId) {
        sessions.remove(sessionId);
    }

    public UserSession getSession(String sessionId) {
        return sessions.get(sessionId);
    }

    public List<UserSession> getRoomSessions(String roomId) {
        List<UserSession> roomSessions = new ArrayList<>();
        for (UserSession us : sessions.values()) {
            if (roomId.equals(us.getRoomId())) {
                roomSessions.add(us);
            }
        }
        return roomSessions;
    }

    public String getNextColor() {
        String color = CURSOR_COLORS[colorIndex % CURSOR_COLORS.length];
        colorIndex++;
        return color;
    }
}
