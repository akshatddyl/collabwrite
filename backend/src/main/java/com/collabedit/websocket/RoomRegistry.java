package com.collabedit.websocket;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RoomRegistry {

    // roomId (invite code) -> current document content per file
    // key: roomId:fileId, value: content
    private final Map<String, String> documentStates = new ConcurrentHashMap<>();

    public void setContent(String roomId, String fileId, String content) {
        documentStates.put(roomId + ":" + fileId, content);
    }

    public String getContent(String roomId, String fileId) {
        return documentStates.getOrDefault(roomId + ":" + fileId, "");
    }

    public boolean hasContent(String roomId, String fileId) {
        return documentStates.containsKey(roomId + ":" + fileId);
    }

    public void removeRoom(String roomId) {
        documentStates.entrySet().removeIf(e -> e.getKey().startsWith(roomId + ":"));
    }
}
