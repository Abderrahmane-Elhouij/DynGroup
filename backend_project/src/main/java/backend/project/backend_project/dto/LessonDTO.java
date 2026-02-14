package backend.project.backend_project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonDTO {
    private Long id;
    private String titre;
    private String contenu;
    private String typeContenu;
    private String dureeEstimee;
    private Integer xpReward;
    private Integer ordre;
    private String statut;
    private Long chapterId;
    private String chapterTitre;
    private Long courseId;
    private String courseTitre;
    private List<QuizSummaryDTO> quizzes;
}
