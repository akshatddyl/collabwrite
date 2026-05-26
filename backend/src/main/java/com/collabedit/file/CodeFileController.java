package com.collabedit.file;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
public class CodeFileController {

    private final CodeFileService codeFileService;

    public CodeFileController(CodeFileService codeFileService) {
        this.codeFileService = codeFileService;
    }

    @GetMapping("/room/{inviteCode}")
    public ResponseEntity<List<CodeFile>> getFiles(@PathVariable UUID inviteCode) {
        return ResponseEntity.ok(codeFileService.getFilesByRoom(inviteCode));
    }

    @PostMapping("/room/{inviteCode}")
    public ResponseEntity<CodeFile> createFile(
            @PathVariable UUID inviteCode,
            @RequestBody Map<String, String> body) {
        String filename = body.get("filename");
        return ResponseEntity.ok(codeFileService.createFile(inviteCode, filename));
    }

    @PutMapping("/{fileId}/rename")
    public ResponseEntity<CodeFile> renameFile(
            @PathVariable Long fileId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(codeFileService.renameFile(fileId, body.get("filename")));
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long fileId) {
        codeFileService.deleteFile(fileId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{fileId}/content")
    public ResponseEntity<CodeFile> updateContent(
            @PathVariable Long fileId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(codeFileService.updateContent(fileId, body.get("content")));
    }

    @GetMapping("/{fileId}/download")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long fileId) {
        CodeFile file = codeFileService.getFile(fileId);
        byte[] content = file.getContent().getBytes();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename(file.getFilename())
                .build());
        return new ResponseEntity<>(content, headers, HttpStatus.OK);
    }
}
