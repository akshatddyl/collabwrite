package com.collabedit.file;

import com.collabedit.room.Room;
import com.collabedit.room.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CodeFileService {

    private final CodeFileRepository codeFileRepository;
    private final RoomRepository roomRepository;

    public CodeFileService(CodeFileRepository codeFileRepository, RoomRepository roomRepository) {
        this.codeFileRepository = codeFileRepository;
        this.roomRepository = roomRepository;
    }

    public List<CodeFile> getFilesByRoom(UUID inviteCode) {
        Room room = roomRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        return codeFileRepository.findByRoomId(room.getId());
    }

    @Transactional
    public CodeFile createFile(UUID inviteCode, String filename) {
        Room room = roomRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (codeFileRepository.findByRoomIdAndFilename(room.getId(), filename).isPresent()) {
            throw new RuntimeException("File already exists: " + filename);
        }

        String className = filename.replace(".java", "");
        String defaultContent = "public class " + className + " {\n\n}\n";

        CodeFile file = CodeFile.builder()
                .room(room)
                .filename(filename)
                .content(defaultContent)
                .build();
        return codeFileRepository.save(file);
    }

    @Transactional
    public CodeFile renameFile(Long fileId, String newFilename) {
        CodeFile file = codeFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));
        file.setFilename(newFilename);
        return codeFileRepository.save(file);
    }

    @Transactional
    public void deleteFile(Long fileId) {
        codeFileRepository.deleteById(fileId);
    }

    @Transactional
    public CodeFile updateContent(Long fileId, String content) {
        CodeFile file = codeFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));
        file.setContent(content);
        return codeFileRepository.save(file);
    }

    public CodeFile getFile(Long fileId) {
        return codeFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));
    }
}
