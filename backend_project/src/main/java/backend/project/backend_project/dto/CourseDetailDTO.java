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
public class CourseDetailDTO {
    private Long id;
    private String titre;
    private String description;
    private String imageUrl;
    private String dureeEstimee;
    private String difficulte;
    private Boolean inscrit;
    private Integer progression;
    private List<ChapterDTO> chapitres;
}
