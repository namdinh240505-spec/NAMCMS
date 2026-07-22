package com.namcms.content.repository;

import com.namcms.content.model.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BannerRepository extends JpaRepository<Banner, Integer> {
    List<Banner> findByIsActive(boolean isActive);
}
