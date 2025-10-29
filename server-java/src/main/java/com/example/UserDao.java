package com.example;

import javax.sql.DataSource;
import java.sql.*;

public class UserDao {
    private static final DataSource ds = DatabaseConnector.getDataSource();

    public static User findByEmail(String email) throws SQLException {
        String sql = "SELECT id, username, email, password_hash FROM users WHERE email = ?";
        try (Connection c = ds.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return new User(
                            rs.getLong("id"),
                            rs.getString("username"),
                            rs.getString("email"),
                            rs.getString("password_hash")
                    );
                }
            }
        }
        return null;
    }

    public static long createUser(String username, String email, String passwordHash) throws SQLException {
        String sql = "INSERT INTO users (username, email, password_hash, created_at) VALUES (?, ?, ?, now()) RETURNING id";
        try (Connection c = ds.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, username);
            ps.setString(2, email);
            ps.setString(3, passwordHash);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getLong(1);
                }
            }
        }
        throw new SQLException("Failed to insert user");
    }
}
