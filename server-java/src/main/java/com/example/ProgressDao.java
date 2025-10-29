package com.example;

import javax.sql.DataSource;
import java.sql.*;

public class ProgressDao {
    private static final DataSource ds = DatabaseConnector.getDataSource();

    public static long upsertProgress(String email, String questId, double progress, String dataJson) throws SQLException {
        // Try to update existing row
        String updateSql = "UPDATE quest_progress SET progress = ?, data = ?, updated_at = now() WHERE email = ? AND quest_id = ? RETURNING id";
        try (Connection c = ds.getConnection(); PreparedStatement ps = c.prepareStatement(updateSql)) {
            ps.setDouble(1, progress);
            ps.setString(2, dataJson);
            ps.setString(3, email);
            ps.setString(4, questId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getLong(1);
                }
            }
        }

        // Insert new row
        String insertSql = "INSERT INTO quest_progress (email, quest_id, progress, data, updated_at) VALUES (?, ?, ?, ?::jsonb, now()) RETURNING id";
        try (Connection c = ds.getConnection(); PreparedStatement ps = c.prepareStatement(insertSql)) {
            ps.setString(1, email);
            ps.setString(2, questId);
            ps.setDouble(3, progress);
            ps.setString(4, dataJson);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getLong(1);
                }
            }
        }
        throw new SQLException("Failed to upsert progress");
    }
}
