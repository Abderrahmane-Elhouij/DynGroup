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
public class QuizDTO {
    private Long id;
    private String titre;
    private String description;
    private Integer xpReward;
    private List<QuestionDTO> questions;
}
