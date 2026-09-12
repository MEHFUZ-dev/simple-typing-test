package typing_test_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import typing_test_backend.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);
}