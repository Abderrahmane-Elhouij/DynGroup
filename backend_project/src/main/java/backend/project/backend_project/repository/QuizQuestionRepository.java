package backend.project.backend_project.repository;

import backend.project.backend_project.entity.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {
    List<QuizQuestion> findByQuizIdOrderByOrdreAsc(Long quizId);
}
