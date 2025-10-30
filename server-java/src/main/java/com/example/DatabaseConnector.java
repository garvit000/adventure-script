package com.example;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import javax.sql.DataSource;

public class DatabaseConnector {
    private static HikariDataSource ds;

    static {
        HikariConfig config = new HikariConfig();
        String jdbcUrl = System.getenv().getOrDefault("DB_URL", "jdbc:postgresql://localhost:5432/postgres");
        String dbUser = System.getenv().getOrDefault("DB_USER", "postgres");
        String dbPass = System.getenv().getOrDefault("DB_PASSWORD", "");
        String maxPool = System.getenv().getOrDefault("DB_MAX_POOL_SIZE", "10");

        config.setJdbcUrl(jdbcUrl);
        config.setUsername(dbUser);
        config.setPassword(dbPass);
        config.setMaximumPoolSize(Integer.parseInt(maxPool));
        config.setPoolName("server-java-hikari");

        ds = new HikariDataSource(config);
    }

    public static DataSource getDataSource() {
        return ds;
    }

    // Initialize DB schema for development (idempotent)
    public static void initializeSchema() {
        String usersSql = "CREATE TABLE IF NOT EXISTS users (" +
                "id SERIAL PRIMARY KEY, " +
                "username TEXT, " +
                "email TEXT UNIQUE NOT NULL, " +
                "password_hash TEXT NOT NULL, " +
                "created_at TIMESTAMP WITH TIME ZONE DEFAULT now()" +
                ")";

        String progressSql = "CREATE TABLE IF NOT EXISTS quest_progress (" +
                "id SERIAL PRIMARY KEY, " +
                "email TEXT NOT NULL, " +
                "quest_id TEXT NOT NULL, " +
                "progress NUMERIC, " +
                "data JSONB, " +
                "updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(), " +
                "UNIQUE (email, quest_id)" +
                ")";

        try (var c = ds.getConnection(); var stmt = c.createStatement()) {
            stmt.execute(usersSql);
            stmt.execute(progressSql);
        } catch (Exception e) {
            // print to stderr; App will also show stacktrace if needed
            e.printStackTrace();
        }
    }
}
