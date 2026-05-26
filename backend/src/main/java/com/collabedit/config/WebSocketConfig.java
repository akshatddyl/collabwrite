package com.collabedit.config;

import com.collabedit.websocket.EditorWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final EditorWebSocketHandler editorWebSocketHandler;

    public WebSocketConfig(EditorWebSocketHandler editorWebSocketHandler) {
        this.editorWebSocketHandler = editorWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(editorWebSocketHandler, "/ws/editor")
                .setAllowedOrigins("*");
    }
}
