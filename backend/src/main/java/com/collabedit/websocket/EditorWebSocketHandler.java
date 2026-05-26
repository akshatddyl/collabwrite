package com.collabedit.websocket;

import com.collabedit.file.CodeFile;
import com.collabedit.file.CodeFileService;
import com.collabedit.websocket.message.IncomingMessage;
import com.collabedit.websocket.message.OutgoingMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class EditorWebSocketHandler extends TextWebSocketHandler {

    private static final Logger log = LoggerFactory.getLogger(EditorWebSocketHandler.class);

    private final SessionManager sessionManager;
    private final RoomRegistry roomRegistry;
    private final OTEngine otEngine;
    private final CodeFileService codeFileService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public EditorWebSocketHandler(SessionManager sessionManager, RoomRegistry roomRegistry,
                                   OTEngine otEngine, CodeFileService codeFileService) {
        this.sessionManager = sessionManager;
        this.roomRegistry = roomRegistry;
        this.otEngine = otEngine;
        this.codeFileService = codeFileService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        log.info("WebSocket connected: {}", session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            IncomingMessage msg = objectMapper.readValue(message.getPayload(), IncomingMessage.class);
            switch (msg.getType()) {
                case "join" -> handleJoin(session, msg);
                case "edit" -> handleEdit(session, msg);
                case "cursor" -> handleCursor(session, msg);
                case "save" -> handleSave(session, msg);
                case "select_file" -> handleSelectFile(session, msg);
                default -> log.warn("Unknown message type: {}", msg.getType());
            }
        } catch (Exception e) {
            log.error("Error handling message: {}", e.getMessage(), e);
            sendError(session, e.getMessage());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        UserSession userSession = sessionManager.getSession(session.getId());
        if (userSession != null) {
            String roomId = userSession.getRoomId();
            String username = userSession.getUsername();
            sessionManager.removeSession(session.getId());

            OutgoingMessage leftMsg = OutgoingMessage.builder()
                    .type("user_left")
                    .username(username)
                    .roomId(roomId)
                    .build();
            broadcastToRoom(roomId, leftMsg, null);
            broadcastUserList(roomId);
        }
        log.info("WebSocket disconnected: {}", session.getId());
    }

    private void handleJoin(WebSocketSession session, IncomingMessage msg) throws IOException {
        sessionManager.addSession(session, msg.getUsername(), msg.getRoomId());
        UserSession userSession = sessionManager.getSession(session.getId());

        OutgoingMessage welcomeMsg = OutgoingMessage.builder()
                .type("welcome")
                .username(msg.getUsername())
                .color(userSession.getColor())
                .roomId(msg.getRoomId())
                .build();
        sendMessage(session, welcomeMsg);

        OutgoingMessage joinMsg = OutgoingMessage.builder()
                .type("user_joined")
                .username(msg.getUsername())
                .color(userSession.getColor())
                .roomId(msg.getRoomId())
                .build();
        broadcastToRoom(msg.getRoomId(), joinMsg, session.getId());
        broadcastUserList(msg.getRoomId());
    }

    private void handleEdit(WebSocketSession session, IncomingMessage msg) {
        UserSession userSession = sessionManager.getSession(session.getId());
        if (userSession == null) return;

        String roomId = userSession.getRoomId();
        String fileId = msg.getFileId();

        String currentContent = roomRegistry.getContent(roomId, fileId);
        String newContent = otEngine.applyEdit(currentContent, msg.getContent());
        roomRegistry.setContent(roomId, fileId, newContent);

        OutgoingMessage editMsg = OutgoingMessage.builder()
                .type("edit")
                .username(userSession.getUsername())
                .fileId(fileId)
                .content(newContent)
                .roomId(roomId)
                .build();
        broadcastToRoom(roomId, editMsg, session.getId());
    }

    private void handleCursor(WebSocketSession session, IncomingMessage msg) {
        UserSession userSession = sessionManager.getSession(session.getId());
        if (userSession == null) return;

        userSession.setCursorLine(msg.getLineNumber() != null ? msg.getLineNumber() : 0);
        userSession.setCursorColumn(msg.getColumn() != null ? msg.getColumn() : 0);
        userSession.setCurrentFileId(msg.getFileId());

        OutgoingMessage cursorMsg = OutgoingMessage.builder()
                .type("cursor")
                .username(userSession.getUsername())
                .color(userSession.getColor())
                .lineNumber(userSession.getCursorLine())
                .column(userSession.getCursorColumn())
                .fileId(msg.getFileId())
                .roomId(userSession.getRoomId())
                .build();
        broadcastToRoom(userSession.getRoomId(), cursorMsg, session.getId());
    }

    private void handleSave(WebSocketSession session, IncomingMessage msg) {
        UserSession userSession = sessionManager.getSession(session.getId());
        if (userSession == null) return;

        try {
            String content = roomRegistry.getContent(userSession.getRoomId(), msg.getFileId());
            codeFileService.updateContent(Long.parseLong(msg.getFileId()), content);
            log.info("File {} saved by {}", msg.getFileId(), userSession.getUsername());
        } catch (Exception e) {
            log.error("Error saving file: {}", e.getMessage());
        }
    }

    private void handleSelectFile(WebSocketSession session, IncomingMessage msg) throws IOException {
        UserSession userSession = sessionManager.getSession(session.getId());
        if (userSession == null) return;

        userSession.setCurrentFileId(msg.getFileId());

        String roomId = userSession.getRoomId();
        String fileId = msg.getFileId();

        if (!roomRegistry.hasContent(roomId, fileId)) {
            try {
                CodeFile file = codeFileService.getFile(Long.parseLong(fileId));
                roomRegistry.setContent(roomId, fileId, file.getContent() != null ? file.getContent() : "");
            } catch (Exception e) {
                roomRegistry.setContent(roomId, fileId, "");
            }
        }

        String content = roomRegistry.getContent(roomId, fileId);
        OutgoingMessage fileContentMsg = OutgoingMessage.builder()
                .type("file_content")
                .fileId(fileId)
                .content(content)
                .roomId(roomId)
                .build();
        sendMessage(session, fileContentMsg);
    }

    private void broadcastUserList(String roomId) {
        List<UserSession> roomSessions = sessionManager.getRoomSessions(roomId);
        List<Map<String, Object>> users = roomSessions.stream()
                .map(us -> {
                    Map<String, Object> user = new HashMap<>();
                    user.put("username", us.getUsername());
                    user.put("color", us.getColor());
                    user.put("cursorLine", us.getCursorLine());
                    user.put("cursorColumn", us.getCursorColumn());
                    user.put("fileId", us.getCurrentFileId());
                    return user;
                })
                .collect(Collectors.toList());

        OutgoingMessage usersMsg = OutgoingMessage.builder()
                .type("users")
                .roomId(roomId)
                .users(users)
                .build();
        broadcastToRoom(roomId, usersMsg, null);
    }

    private void broadcastToRoom(String roomId, OutgoingMessage message, String excludeSessionId) {
        List<UserSession> roomSessions = sessionManager.getRoomSessions(roomId);
        for (UserSession us : roomSessions) {
            if (excludeSessionId != null && us.getSession().getId().equals(excludeSessionId)) continue;
            try {
                sendMessage(us.getSession(), message);
            } catch (IOException e) {
                log.error("Error sending message to {}: {}", us.getUsername(), e.getMessage());
            }
        }
    }

    private void sendMessage(WebSocketSession session, OutgoingMessage message) throws IOException {
        if (session.isOpen()) {
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(message)));
        }
    }

    private void sendError(WebSocketSession session, String error) {
        try {
            OutgoingMessage errorMsg = OutgoingMessage.builder()
                    .type("error")
                    .content(error)
                    .build();
            sendMessage(session, errorMsg);
        } catch (IOException e) {
            log.error("Error sending error message: {}", e.getMessage());
        }
    }
}
