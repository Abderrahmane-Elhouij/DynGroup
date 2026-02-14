package backend.project.backend_project.repository;

import backend.project.backend_project.entity.UserQuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserQuizAttemptRepository extends JpaRepository<UserQuizAttempt, Long> {
    List<UserQuizAttempt> findByUserIdAndQuizId(Long userId, Long quizId);
    List<UserQuizAttempt> findByUserId(Long userId);
}
