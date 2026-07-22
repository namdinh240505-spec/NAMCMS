package com.namcms.auth.model;

import jakarta.persistence.*;

@Entity
@Table(name = "customeraddresses")
public class CustomerAddress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @Column(name = "CustomerId", nullable = false)
    private Integer customerId;

    @Column(name = "ReceiverName", nullable = false, length = 200)
    private String receiverName;

    @Column(name = "ReceiverPhone", nullable = false, length = 50)
    private String receiverPhone;

    @Column(name = "AddressLine", nullable = false, length = 500)
    private String addressLine;

    @Column(name = "IsDefault", nullable = false)
    private boolean isDefault;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }
    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }
    public String getReceiverPhone() { return receiverPhone; }
    public void setReceiverPhone(String receiverPhone) { this.receiverPhone = receiverPhone; }
    public String getAddressLine() { return addressLine; }
    public void setAddressLine(String addressLine) { this.addressLine = addressLine; }
    public boolean isDefault() { return isDefault; }
    public void setDefault(boolean isDefault) { this.isDefault = isDefault; }
}
