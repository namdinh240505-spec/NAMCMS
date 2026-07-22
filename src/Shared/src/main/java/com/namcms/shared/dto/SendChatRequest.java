package com.namcms.shared.dto;

public class SendChatRequest {
    private int customerId;
    private String content;

    public int getCustomerId() { return customerId; }
    public void setCustomerId(int customerId) { this.customerId = customerId; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
