package backend.project.backend_project.repository;

import backend.project.backend_project.entity.UserProgress;
import backend.project.backend_project.entity.StatutProgression;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {
    Optional<UserProgress> findByUserIdAndLessonId(Long userId, Long lessonId);
    List<UserProgress> findByUserId(Long userId);
    long countByUserIdAndStatut(Long userId, StatutProgression statut);
    List<UserProgress> findByUserIdAndLessonChapterCourseId(Long userId, Long courseId);
}
