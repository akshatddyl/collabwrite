package com.collabedit.websocket;

import org.springframework.stereotype.Component;

/**
 * OT Engine for operational transform.
 * In our architecture, we use a simple "last-write-wins" with full document sync
 * approach combined with cursor broadcasting. The frontend uses Yjs for CRDT-based
 * conflict resolution, and the server acts as a relay + persistence layer.
 *
 * For a production system, the server would run its own Yjs document instance,
 * but for our use case, the server relays edits and persists the latest state.
 */
@Component
public class OTEngine {

    /**
     * Apply a full document update from a client.
     * Since we use Yjs on the frontend for CRDT, the server just
     * accepts the latest content and broadcasts it.
     */
    public String applyEdit(String currentContent, String newContent) {
        // With Yjs CRDT on the frontend, the server receives already-resolved content
        return newContent;
    }

    /**
     * Transform cursor position based on concurrent edits.
     * With Yjs awareness protocol handling this on the frontend,
     * the server just relays cursor positions.
     */
    public int[] transformCursor(int line, int column, String oldContent, String newContent) {
        return new int[]{line, column};
    }
}
