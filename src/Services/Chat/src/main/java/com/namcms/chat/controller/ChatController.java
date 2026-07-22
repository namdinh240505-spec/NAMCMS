package com.namcms.chat.controller;

import com.namcms.chat.client.AuthServiceClient;
import com.namcms.chat.model.ChatMessage;
import com.namcms.chat.repository.ChatMessageRepository;
import com.namcms.shared.dto.ApiResponse;
import com.namcms.shared.dto.SendChatRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private AuthServiceClient authServiceClient;

    @GetMapping("/{customerId}")
    @Transactional
    public ResponseEntity<List<ChatMessage>> getHistory(@PathVariable Integer customerId) {
        // Mark all messages as read
        chatMessageRepository.markAsReadByCustomerId(customerId);
        
        List<ChatMessage> list = chatMessageRepository.findByCustomerIdOrderBySentAtAsc(customerId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<Map<String, Object>>> getConversations() {
        List<Map<String, Object>> conversations = chatMessageRepository.getConversations();
        
        // Collect all customer IDs to batch-fetch names from Auth Service
        List<Integer> customerIds = conversations.stream()
                .map(c -> ((Number) c.get("customerId")).intValue())
                .collect(Collectors.toList());

        // Batch fetch customer names via HTTP call to Auth Service
        Map<Integer, String> customerNames = authServiceClient.getCustomerNames(customerIds);

        // Enrich conversations with customer names
        List<Map<String, Object>> enriched = new ArrayList<>();
        for (Map<String, Object> conv : conversations) {
            Map<String, Object> enrichedConv = new HashMap<>(conv);
            Integer customerId = ((Number) conv.get("customerId")).intValue();
            enrichedConv.put("customerName", customerNames.getOrDefault(customerId, "Khách hàng #" + customerId));
            enriched.add(enrichedConv);
        }

        return ResponseEntity.ok(enriched);
    }

    @PostMapping
    public ResponseEntity<?> sendFromCustomer(@RequestBody SendChatRequest request) {
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Nội dung tin nhắn không được trống."));
        }

        ChatMessage msg = new ChatMessage();
        msg.setCustomerId(request.getCustomerId());
        msg.setContent(request.getContent());
        msg.setFromAdmin(false);
        msg.setRead(false);
        msg.setSentAt(LocalDateTime.now());

        ChatMessage saved = chatMessageRepository.save(msg);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/admin")
    public ResponseEntity<?> sendFromAdmin(@RequestBody SendChatRequest request) {
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Nội dung tin nhắn không được trống."));
        }

        ChatMessage msg = new ChatMessage();
        msg.setCustomerId(request.getCustomerId());
        msg.setContent(request.getContent());
        msg.setFromAdmin(true);
        msg.setRead(true);
        msg.setSentAt(LocalDateTime.now());

        ChatMessage saved = chatMessageRepository.save(msg);
        return ResponseEntity.ok(saved);
    }
}
