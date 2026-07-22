package com.namcms.order.repository;

import com.namcms.order.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByCustomerIdOrderByOrderDateDesc(Integer customerId);
}
