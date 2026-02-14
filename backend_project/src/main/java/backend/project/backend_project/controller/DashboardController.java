package backend.project.backend_project.controller;

import backend.project.backend_project.dto.DashboardDTO;
import backend.project.backend_project.dto.LeaderboardEntryDTO;
import backend.project.backend_project.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDTO> getDashboard(Authentication authentication) {
        return ResponseEntity.ok(dashboardService.getDashboard(authentication.getName()));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardEntryDTO>> getLeaderboard() {
        return ResponseEntity.ok(dashboardService.getLeaderboard());
    }
}
