package com.namcms.chat.repository;

import com.namcms.chat.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Map;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {
    
    List<ChatMessage> findByCustomerIdOrderBySentAtAsc(Integer customerId);

    @Modifying
    @Query("UPDATE ChatMessage m SET m.isRead = true WHERE m.customerId = :customerId AND m.isFromAdmin = false")
    void markAsReadByCustomerId(@Param("customerId") Integer customerId);

    /**
     * Get conversations list with unread counts and last message details.
     * NOTE: No longer JOINs with customers table (cross-service).
     * Customer name is enriched via HTTP call to Auth Service in ChatController.
     */
    @Query(value = "SELECT m.customer_id AS customerId, m.content AS lastMessage, " +
            "m.sent_at AS lastMessageAt, " +
            "(SELECT COUNT(*) FROM chatmessages WHERE customer_id = m.customer_id AND is_from_admin = false AND is_read = false) AS unreadCount " +
            "FROM chatmessages m " +
            "WHERE m.id IN (SELECT MAX(id) FROM chatmessages GROUP BY customer_id) " +
            "ORDER BY m.sent_at DESC", nativeQuery = true)
    List<Map<String, Object>> getConversations();
}
