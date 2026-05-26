package com.collabedit.websocket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Component
public class SessionManager {

    private static final Logger log = LoggerFactory.getLogger(SessionManager.class);

    // Primary map: WebSocket sessionId -> UserSession
    private final Map<String, UserSession> sessions = new ConcurrentHashMap<>();

    // Reverse map: "username:roomId" -> WebSocket sessionId
    // This allows us to detect when a user reconnects and evict their old session.
    private final Map<String, String> userRoomToSessionId = new ConcurrentHashMap<>();

    private static final String[] CURSOR_COLORS = {
        "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
        "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
        "#F1948A", "#82E0AA", "#F8C471", "#AED6F1", "#D7BDE2",
        "#A3E4D7", "#FAD7A0", "#A9CCE3", "#D5DBDB", "#EDBB99"
    };

    private int colorIndex = 0;

    /**
     * Registers a new WebSocket session for a user in a room.
     * If the same user (by username) already has an active session in this room,
     * the old session is evicted first to prevent ghost duplicates.
     *
     * @return the color assigned to this user (preserved across reconnects in the same room)
     */
    public String addSession(WebSocketSession session, String username, String roomId) {
        String userRoomKey = buildUserRoomKey(username, roomId);
        String color;

        // Check if this user already has a session in this room
        String existingSessionId = userRoomToSessionId.get(userRoomKey);
        if (existingSessionId != null) {
            UserSession existingSession = sessions.get(existingSessionId);
            if (existingSession != null) {
                // Preserve the user's color across reconnects
                color = existingSession.getColor();
                // Close the stale WebSocket connection gracefully
                closeStaleSession(existingSession.getSession());
                // Remove the old session entry
                sessions.remove(existingSessionId);
                log.info("Evicted stale session {} for user '{}' in room '{}'",
                        existingSessionId, username, roomId);
            } else {
                // Orphaned reverse-map entry; assign a new color
                color = getNextColor();
            }
        } else {
            color = getNextColor();
        }

        // Register the new session
        UserSession userSession = new UserSession(session, username, roomId, color, null, 0, 0);
        sessions.put(session.getId(), userSession);
        userRoomToSessionId.put(userRoomKey, session.getId());

        log.info("Registered session {} for user '{}' in room '{}' (color: {})",
                session.getId(), username, roomId, color);
        return color;
    }

    /**
     * Removes a session by its WebSocket session ID.
     * Also cleans up the reverse map, but only if the reverse map still points
     * to this session (it may have already been replaced by a newer session).
     */
    public void removeSession(String sessionId) {
        UserSession removed = sessions.remove(sessionId);
        if (removed != null) {
            String userRoomKey = buildUserRoomKey(removed.getUsername(), removed.getRoomId());
            // Only remove from reverse map if it still points to this session.
            // If the user reconnected, the reverse map already points to the new session.
            userRoomToSessionId.remove(userRoomKey, sessionId);
            log.info("Removed session {} for user '{}' in room '{}'",
                    sessionId, removed.getUsername(), removed.getRoomId());
        }
    }

    public UserSession getSession(String sessionId) {
        return sessions.get(sessionId);
    }

    /**
     * Returns the list of active sessions in a room, deduplicated by username.
     * If somehow multiple sessions exist for the same user (race condition),
     * only the most recent one (by reverse-map lookup) is included.
     */
    public List<UserSession> getRoomSessions(String roomId) {
        Map<String, UserSession> uniqueUsers = new LinkedHashMap<>();
        for (UserSession us : sessions.values()) {
            if (roomId.equals(us.getRoomId())) {
                // If we already have this user, keep the one the reverse map points to
                if (uniqueUsers.containsKey(us.getUsername())) {
                    String userRoomKey = buildUserRoomKey(us.getUsername(), roomId);
                    String canonicalSessionId = userRoomToSessionId.get(userRoomKey);
                    if (canonicalSessionId != null && canonicalSessionId.equals(us.getSession().getId())) {
                        uniqueUsers.put(us.getUsername(), us);
                    }
                    // else keep the existing one
                } else {
                    uniqueUsers.put(us.getUsername(), us);
                }
            }
        }
        return new ArrayList<>(uniqueUsers.values());
    }

    /**
     * Check if a user (by username) still has an active session in the given room.
     * This is used after removing a session to decide whether to broadcast USER_LEFT.
     */
    public boolean isUserStillInRoom(String username, String roomId) {
        String userRoomKey = buildUserRoomKey(username, roomId);
        String sessionId = userRoomToSessionId.get(userRoomKey);
        return sessionId != null && sessions.containsKey(sessionId);
    }

    private String getNextColor() {
        String color = CURSOR_COLORS[colorIndex % CURSOR_COLORS.length];
        colorIndex++;
        return color;
    }

    private String buildUserRoomKey(String username, String roomId) {
        return username + ":" + roomId;
    }

    /**
     * Gracefully close a stale WebSocket session, suppressing any errors
     * (the connection may already be dead).
     */
    private void closeStaleSession(WebSocketSession session) {
        if (session != null && session.isOpen()) {
            try {
                session.close();
            } catch (IOException e) {
                log.warn("Error closing stale session {}: {}", session.getId(), e.getMessage());
            }
        }
    }
}
