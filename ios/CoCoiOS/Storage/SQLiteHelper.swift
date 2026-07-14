import Foundation
import SQLite3

/// 内存 SQL 数据库助手类：无需外置 SPM 包依赖，直接利用 SDK 内置的 sqlite3 库。
final class SQLiteHelper {
    private var db: OpaquePointer?

    init() {
        if sqlite3_open(":memory:", &db) != SQLITE_OK {
            print("[SQLite] 无法在内存中打开数据库")
        } else {
            seed()
        }
    }

    deinit {
        sqlite3_close(db)
    }

    /// 执行 DDL/DML
    @discardableResult
    func execute(_ sql: String) -> Bool {
        var stmt: OpaquePointer?
        guard sqlite3_prepare_v2(db, sql, -1, &stmt, nil) == SQLITE_OK else {
            return false
        }
        let step = sqlite3_step(stmt)
        sqlite3_finalize(stmt)
        return step == SQLITE_DONE || step == SQLITE_ROW
    }

    /// 执行查询并返回 (表头, 数据行)
    func query(_ sql: String) -> (headers: [String], rows: [[String]])? {
        var stmt: OpaquePointer?
        guard sqlite3_prepare_v2(db, sql, -1, &stmt, nil) == SQLITE_OK else {
            return nil
        }
        
        var headers: [String] = []
        let colCount = sqlite3_column_count(stmt)
        for i in 0..<colCount {
            if let charName = sqlite3_column_name(stmt, i) {
                headers.append(String(cString: charName))
            } else {
                headers.append("col_\(i)")
            }
        }
        
        var rows: [[String]] = []
        while sqlite3_step(stmt) == SQLITE_ROW {
            var row: [String] = []
            for i in 0..<colCount {
                if let text = sqlite3_column_text(stmt, i) {
                    row.append(String(cString: text))
                } else {
                    row.append("NULL")
                }
            }
            rows.append(row)
        }
        sqlite3_finalize(stmt)
        return (headers, rows)
    }
    
    /// 获取最新的错误信息
    func lastError() -> String {
        if let err = sqlite3_errmsg(db) {
            return String(cString: err)
        }
        return "未知错误"
    }

    /// 初始化预设种子练习表
    private func seed() {
        let seedSql = """
        CREATE TABLE students_mst (
            id INTEGER PRIMARY KEY,
            name TEXT,
            score INTEGER,
            class TEXT
        );
        INSERT INTO students_mst VALUES (1, '佐藤', 85, 'A');
        INSERT INTO students_mst VALUES (2, '铃木', 72, 'B');
        INSERT INTO students_mst VALUES (3, '高桥', 93, 'A');
        INSERT INTO students_mst VALUES (4, '田中', 64, 'B');
        INSERT INTO students_mst VALUES (5, '渡边', 78, 'A');
        """
        execute(seedSql)
    }
}
