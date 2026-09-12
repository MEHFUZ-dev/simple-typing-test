package typing_test_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import typing_test_backend.entity.TypingResult;

import java.util.List;

public interface TypingResultRepository extends JpaRepository<TypingResult, Long> {

    List<TypingResult> findByUserIdOrderByCreatedAtDesc(Long userId);

}