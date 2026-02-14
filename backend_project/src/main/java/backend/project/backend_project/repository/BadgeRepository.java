package backend.project.backend_project.repository;

import backend.project.backend_project.entity.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BadgeRepository extends JpaRepository<Badge, Long> {
    List<Badge> findByConditionType(String conditionType);
}
