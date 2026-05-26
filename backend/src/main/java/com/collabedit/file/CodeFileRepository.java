package com.collabedit.file;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CodeFileRepository extends JpaRepository<CodeFile, Long> {
    List<CodeFile> findByRoomId(Long roomId);
    Optional<CodeFile> findByRoomIdAndFilename(Long roomId, String filename);
}
