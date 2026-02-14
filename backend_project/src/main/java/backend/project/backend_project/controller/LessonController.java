package backend.project.backend_project.controller;

import backend.project.backend_project.dto.LessonDTO;
import backend.project.backend_project.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;

    @GetMapping("/{id}")
    public ResponseEntity<LessonDTO> getLesson(@PathVariable Long id, Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(lessonService.getLesson(id, email));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Void> completeLesson(@PathVariable Long id, Authentication authentication) {
        lessonService.completeLesson(id, authentication.getName());
        return ResponseEntity.ok().build();
    }
}
