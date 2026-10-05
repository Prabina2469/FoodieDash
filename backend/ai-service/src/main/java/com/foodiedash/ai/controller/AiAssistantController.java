package com.foodiedash.ai.controller;

import com.foodiedash.ai.service.AiAssistantService;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/v1/ai")
@CrossOrigin(origins = "*")
public class AiAssistantController {

    private final AiAssistantService aiAssistantService;

    public AiAssistantController(AiAssistantService aiAssistantService) {
        this.aiAssistantService = aiAssistantService;
    }

    @PostMapping("/prompt")
    public Map<String, Object> handlePrompt(@RequestBody Map<String, String> request) {
        String prompt = request.getOrDefault("prompt", "Analyze platform throughput");
        String context = request.getOrDefault("context", "dashboard");
        return aiAssistantService.generateOperationsInsight(prompt, context);
    }

    @GetMapping("/insights/summary")
    public Map<String, Object> getQuickInsights() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("status", "ACTIVE");
        summary.put("framework", "Spring AI 1.0.0");
        summary.put("activeAgents", 3);
        summary.put("topRecommendation", "Increase courier surge pay in Soho between 6 PM - 8 PM to reduce order preparation SLA from 18 min to 12 min.");
        return summary;
    }
}
