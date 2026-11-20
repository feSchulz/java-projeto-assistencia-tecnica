package com.assitenciaTecnica.logos.controllers.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityFilterChain {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityFilterChain(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public DefaultSecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/v1/login",
                                "/api/auth/v1/logout",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html").permitAll()
                        // Permissões por papel: o papel vem do token (ROLE_<CODIGO>); "adm" é o
                        // administrador. Os demais papéis usam o sistema no dia a dia, mas não
                        // gerenciam papéis/funcionários, não veem a auditoria e não excluem registros.
                        .requestMatchers("/api/papeis/**").hasRole("ADM")
                        .requestMatchers("/api/auditoria/**").hasRole("ADM")
                        .requestMatchers(HttpMethod.POST, "/api/funcionarios/**").hasRole("ADM")
                        .requestMatchers(HttpMethod.PUT, "/api/funcionarios/**").hasRole("ADM")
                        .requestMatchers(HttpMethod.DELETE, "/api/**").hasRole("ADM")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}