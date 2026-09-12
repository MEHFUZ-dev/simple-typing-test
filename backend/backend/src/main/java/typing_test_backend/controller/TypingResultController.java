package typing_test_backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import typing_test_backend.entity.TypingResult;
import typing_test_backend.entity.User;
import typing_test_backend.repository.TypingResultRepository;
import typing_test_backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/results")
public class TypingResultController {

    private final TypingResultRepository resultRepository;
    private final UserRepository userRepository;

    public TypingResultController(
            TypingResultRepository resultRepository,
            UserRepository userRepository
    ) {
        this.resultRepository = resultRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public TypingResult saveResult(
            @RequestBody TypingResult result,
            Authentication authentication
    ) {

        String username = authentication.getName();

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        result.setUserId(user.getId());

        result.setCreatedAt(LocalDateTime.now());

        return resultRepository.save(result);
    }

    @GetMapping
    public List<TypingResult> getMyResults(
            Authentication authentication
    ) {

        String username = authentication.getName();

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return resultRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    @GetMapping("/{id}")
    public TypingResult getMyResultById(
            @PathVariable Long id,
            Authentication authentication
    ) {

        String username = authentication.getName();

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        TypingResult result = resultRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Result not found")
                );

        // Make sure the result belongs to the logged-in user
        if (!result.getUserId().equals(user.getId())) {
            throw new RuntimeException("You are not allowed to view this result");
        }

        return result;
    }

    @DeleteMapping("/{id}")
    public void deleteMyResult(
            @PathVariable Long id,
            Authentication authentication
    ) {

        String username = authentication.getName();

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        TypingResult result = resultRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Result not found")
                );

        if (!result.getUserId().equals(user.getId())) {
            throw new RuntimeException(
                    "You are not allowed to delete this result"
            );
        }

        resultRepository.delete(result);
    }
}