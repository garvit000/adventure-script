package com.example;

import io.javalin.Javalin;
import org.mindrot.jbcrypt.BCrypt;

import java.util.HashMap;
import java.util.Map;

public class App {
    public static void main(String[] args) {
        int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "7000"));
        Javalin app = Javalin.create().start(port);

        // Very small CORS helper for local development
        app.before(ctx -> {
            ctx.header("Access-Control-Allow-Origin", "*");
            ctx.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
            ctx.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        });
        app.options("/*", ctx -> {
            ctx.status(204);
        });

        // Global exception handler to ensure JSON responses on unexpected errors
        app.exception(Exception.class, (e, ctx) -> {
            e.printStackTrace();
            ctx.status(500).json(Map.of("error", "internal error"));
        });

        app.post("/api/register", ctx -> {
            try {
                RegisterRequest req = ctx.bodyAsClass(RegisterRequest.class);
                if (req.email == null || req.password == null) {
                    ctx.status(400).json(Map.of("error", "email and password required"));
                    return;
                }
                if (UserDao.findByEmail(req.email) != null) {
                    ctx.status(400).json(Map.of("error", "email already registered"));
                    return;
                }
                String hashed = BCrypt.hashpw(req.password, BCrypt.gensalt());
                long id = UserDao.createUser(req.username == null ? "" : req.username, req.email, hashed);
                Map<String, Object> res = new HashMap<>();
                res.put("id", id);
                res.put("message", "created");
                ctx.status(201).json(res);
            } catch (Exception e) {
                e.printStackTrace();
                ctx.status(500).json(Map.of("error", "internal error"));
            }
        });

        app.post("/api/login", ctx -> {
            try {
                LoginRequest req = ctx.bodyAsClass(LoginRequest.class);
                if (req.email == null || req.password == null) {
                    ctx.status(400).json(Map.of("error", "email and password required"));
                    return;
                }
                User user = UserDao.findByEmail(req.email);
                if (user == null) {
                    ctx.status(401).json(Map.of("error", "invalid credentials"));
                    return;
                }
                if (BCrypt.checkpw(req.password, user.getPasswordHash())) {
                    ctx.json(Map.of("id", user.getId(), "username", user.getUsername(), "email", user.getEmail()));
                } else {
                    ctx.status(401).json(Map.of("error", "invalid credentials"));
                }
            } catch (Exception e) {
                e.printStackTrace();
                ctx.status(500).json(Map.of("error", "internal error"));
            }
        });

        app.post("/api/progress", ctx -> {
            ProgressRequest req = ctx.bodyAsClass(ProgressRequest.class);
            if (req.email == null || req.questId == null) {
                ctx.status(400).json(java.util.Map.of("error", "email and questId required"));
                return;
            }
            try {
                long id = ProgressDao.upsertProgress(req.email, req.questId, req.progress, req.data == null ? "null" : req.data);
                ctx.json(java.util.Map.of("id", id, "message", "ok"));
            } catch (Exception e) {
                e.printStackTrace();
                ctx.status(500).json(java.util.Map.of("error", "internal error"));
            }
        });
    }

    public static class RegisterRequest {
        public String username;
        public String email;
        public String password;
    }

    public static class LoginRequest {
        public String email;
        public String password;
    }

    public static class ProgressRequest {
        public String email;
        public String questId;
        public double progress;
        public String data; // optional JSON string
    }
}
