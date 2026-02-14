package backend.project.backend_project.controller;

import backend.project.backend_project.dto.CourseDTO;
import backend.project.backend_project.dto.CourseDetailDTO;
import backend.project.backend_project.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(courseService.getAllCourses(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDetailDTO> getCourseDetail(@PathVariable Long id, Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(courseService.getCourseDetail(id, email));
    }

    @PostMapping("/{id}/enroll")
    public ResponseEntity<Void> enrollInCourse(@PathVariable Long id, Authentication authentication) {
        courseService.enrollInCourse(id, authentication.getName());
        return ResponseEntity.ok().build();
    }
}
