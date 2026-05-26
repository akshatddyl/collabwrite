package com.collabedit.room;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.*;

public interface RoomRepository extends JpaRepository<Room, Long> {
    Optional<Room> findByInviteCode(UUID inviteCode);

    @Query("SELECT r FROM Room r WHERE r.owner.id = :userId OR :userId IN (SELECT m.id FROM r.members m)")
    List<Room> findAllByUserId(@Param("userId") Long userId);
}
