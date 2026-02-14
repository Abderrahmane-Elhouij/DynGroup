package backend.project.backend_project.controller;

import backend.project.backend_project.dto.QuizDTO;
import backend.project.backend_project.dto.QuizResultDTO;
import backend.project.backend_project.dto.QuizSubmission;
import backend.project.backend_project.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @GetMapping("/{id}")
    public ResponseEntity<QuizDTO> getQuiz(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuiz(id));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<QuizResultDTO> submitQuiz(
            @PathVariable Long id,
            @RequestBody QuizSubmission submission,
            Authentication authentication) {
        return ResponseEntity.ok(quizService.submitQuiz(id, submission, authentication.getName()));
    }
}
