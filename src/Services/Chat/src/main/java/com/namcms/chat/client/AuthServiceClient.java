package com.namcms.chat.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

/**
 * HTTP client for Chat Service to communicate with Auth Service.
 * Replaces direct database JOIN to the customers table.
 */
@Component
public class AuthServiceClient {

    private final RestTemplate restTemplate;

    @Value("${services.auth-url}")
    private String authServiceUrl;

    public AuthServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Get customer full name by ID.
     * Replaces: JOIN customers c ON ... to get c.FullName
     */
    public String getCustomerName(Integer customerId) {
        String url = authServiceUrl + "/api/user/customers/" + customerId;
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            if (response.getBody() != null) {
                return (String) response.getBody().get("fullName");
            }
            return "Khách hàng #" + customerId;
        } catch (Exception e) {
            return "Khách hàng #" + customerId;
        }
    }

    /**
     * Batch get customer names by IDs.
     * More efficient than calling getCustomerName one by one.
     * Returns a map of customerId -> customerName
     */
    public Map<Integer, String> getCustomerNames(List<Integer> customerIds) {
        String url = authServiceUrl + "/api/user/customers/batch";
        Map<Integer, String> result = new HashMap<>();
        
        try {
            ResponseEntity<Map<String, Map<String, String>>> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                new HttpEntity<>(customerIds),
                new ParameterizedTypeReference<Map<String, Map<String, String>>>() {}
            );
            
            if (response.getBody() != null) {
                for (Map.Entry<String, Map<String, String>> entry : response.getBody().entrySet()) {
                    Integer id = Integer.parseInt(entry.getKey());
                    String fullName = entry.getValue().get("fullName");
                    result.put(id, fullName != null ? fullName : "Khách hàng #" + id);
                }
            }
        } catch (Exception e) {
            // Fallback: return placeholder names
            for (Integer id : customerIds) {
                result.put(id, "Khách hàng #" + id);
            }
        }
        
        return result;
    }
}
