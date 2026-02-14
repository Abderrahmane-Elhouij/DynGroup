package backend.project.backend_project.repository;

import backend.project.backend_project.entity.UserCourseEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserCourseEnrollmentRepository extends JpaRepository<UserCourseEnrollment, Long> {
    Optional<UserCourseEnrollment> findByUserIdAndCourseId(Long userId, Long courseId);
    List<UserCourseEnrollment> findByUserId(Long userId);
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
    long countByUserId(Long userId);
}
