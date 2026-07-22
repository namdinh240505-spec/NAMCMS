package com.namcms.chat.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chatmessages")
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @Column(name = "CustomerId", nullable = false)
    private Integer customerId;

    @Column(name = "Content", nullable = false, length = 1000)
    private String content;

    @Column(name = "SentAt")
    private LocalDateTime sentAt = LocalDateTime.now();

    @JsonProperty("isFromAdmin")
    @Column(name = "IsFromAdmin", nullable = false)
    private boolean isFromAdmin;

    @JsonProperty("isRead")
    @Column(name = "IsRead", nullable = false)
    private boolean isRead;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
    public boolean isFromAdmin() { return isFromAdmin; }
    public void setFromAdmin(boolean isFromAdmin) { this.isFromAdmin = isFromAdmin; }
    public boolean isRead() { return isRead; }
    public void setRead(boolean isRead) { this.isRead = isRead; }
}
