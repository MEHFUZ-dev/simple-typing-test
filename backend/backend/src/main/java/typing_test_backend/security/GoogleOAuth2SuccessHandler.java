package typing_test_backend.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import typing_test_backend.entity.User;
import typing_test_backend.repository.UserRepository;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class GoogleOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public GoogleOAuth2SuccessHandler(
            UserRepository userRepository,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException, ServletException {

        OAuth2User googleUser =
                (OAuth2User) authentication.getPrincipal();

        String email = googleUser.getAttribute("email");
        String name = googleUser.getAttribute("name");

        User user = userRepository
                .findByEmail(email)
                .orElseGet(() -> {

                    User newUser = new User();

                    newUser.setUsername(name);
                    newUser.setEmail(email);
                    newUser.setPassword(null);
                    newUser.setAuthProvider("GOOGLE");
                    newUser.setCreatedAt(LocalDateTime.now());

                    return userRepository.save(newUser);
                });

        String token = jwtService.generateToken(user.getUsername());

        response.sendRedirect(
                "http://localhost:4200/?token=" + token
        );
    }
}