import json
import os
import re
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from backend.app.repositories.base import CaseRepository

class SQLiteCaseRepository(CaseRepository):
    def __init__(self, db_path: str, seed_data_path: Optional[str] = None):
        self.db_path = db_path
        self.seed_data_path = seed_data_path
        self._init_db()

    def _get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        # Ensure parent directory exists
        if self.db_path != ":memory:":
            Path(self.db_path).parent.mkdir(parents=True, exist_ok=True)

        with self._get_connection() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS cases (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    category TEXT,
                    priority TEXT,
                    status TEXT,
                    created_at TEXT,
                    updated_at TEXT,
                    order_id TEXT,
                    amount TEXT,
                    assigned_team TEXT,
                    assigned_agent TEXT,
                    customer_name TEXT,
                    customer_email TEXT,
                    complaint_text TEXT,
                    data_json TEXT NOT NULL
                )
            """)
            conn.commit()

            # Seed initial cases if table is empty and seed file exists
            cursor = conn.execute("SELECT COUNT(*) FROM cases")
            count = cursor.fetchone()[0]
            if count == 0 and self.seed_data_path and os.path.exists(self.seed_data_path):
                self._seed_initial_data(conn)

    def _seed_initial_data(self, conn: sqlite3.Connection):
        try:
            with open(self.seed_data_path, "r", encoding="utf-8") as f:
                cases = json.load(f)
                for case_data in cases:
                    self._insert_row(conn, case_data)
                conn.commit()
        except Exception as e:
            print(f"[ARGUS Repository] Error seeding initial data: {e}")

    def _insert_row(self, conn: sqlite3.Connection, case_data: Dict[str, Any]):
        customer = case_data.get("customer", {})
        conn.execute(
            """
            INSERT OR REPLACE INTO cases (
                id, title, category, priority, status,
                created_at, updated_at, order_id, amount,
                assigned_team, assigned_agent, customer_name,
                customer_email, complaint_text, data_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                case_data.get("id"),
                case_data.get("title", ""),
                case_data.get("category", "General"),
                case_data.get("priority", "Medium"),
                case_data.get("status", "Under Review"),
                case_data.get("createdAt", ""),
                case_data.get("updatedAt", ""),
                case_data.get("orderId", ""),
                case_data.get("amount", ""),
                case_data.get("assignedTeam", ""),
                case_data.get("assignedAgent", ""),
                customer.get("name", ""),
                customer.get("email", ""),
                case_data.get("complaintText", ""),
                json.dumps(case_data),
            ),
        )

    def list(
        self,
        status: Optional[str] = None,
        category: Optional[str] = None,
        priority: Optional[str] = None,
        date_range: Optional[str] = None,
        query: Optional[str] = None,
        sort_by: Optional[str] = "date_desc",
    ) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.execute("SELECT data_json FROM cases")
            rows = cursor.fetchall()

        cases: List[Dict[str, Any]] = [json.loads(row["data_json"]) for row in rows]

        # 1. Status Filter
        if status and status.lower() != "all":
            s = status.lower().strip()
            filtered = []
            for c in cases:
                cs = (c.get("status") or "").lower()
                if s == "investigating" and "investigat" in cs:
                    filtered.append(c)
                elif ("contradiction" in s or s == "contradiction detected") and "contradict" in cs:
                    filtered.append(c)
                elif ("human" in s or s == "human review" or s == "escalated") and ("human" in cs or "escalat" in cs):
                    filtered.append(c)
                elif s == "resolved" and "resolv" in cs:
                    filtered.append(c)
                elif "evidence" in s and "evidence" in cs:
                    filtered.append(c)
                elif cs == s:
                    filtered.append(c)
            cases = filtered

        # 2. Category Filter
        if category and category.lower() != "all":
            cat = category.lower().strip()
            cases = [c for c in cases if cat in (c.get("category") or "").lower()]

        # 3. Priority Filter
        if priority and priority.lower() != "all":
            p = priority.lower().strip()
            filtered = []
            for c in cases:
                cp = (c.get("priority") or "").lower()
                if p in ("urgent", "critical") and cp in ("urgent", "critical"):
                    filtered.append(c)
                elif cp == p:
                    filtered.append(c)
            cases = filtered

        # 4. Date Range Filter
        if date_range and date_range.lower() != "all":
            now = datetime.now(timezone.utc).timestamp()
            filtered = []
            for c in cases:
                date_str = c.get("updatedAt") or c.get("createdAt") or ""
                if not date_str:
                    filtered.append(c)
                    continue
                try:
                    # Clean date string: e.g. "2026-10-14 14:22:00" or ISO format
                    clean_str = date_str.replace(" ", "T")
                    if len(clean_str) == 10:  # YYYY-MM-DD
                        clean_str += "T00:00:00Z"
                    elif not clean_str.endswith("Z") and "+" not in clean_str:
                        clean_str += "Z"
                    c_dt = datetime.fromisoformat(clean_str.replace("Z", "+00:00")).timestamp()
                    diff_days = (now - c_dt) / (60 * 60 * 24)
                    if date_range == "today" and diff_days <= 1.5:
                        filtered.append(c)
                    elif date_range == "7d" and diff_days <= 7.5:
                        filtered.append(c)
                    elif date_range == "30d" and diff_days <= 30.5:
                        filtered.append(c)
                except Exception:
                    filtered.append(c)
            cases = filtered

        # 5. Search Query
        if query and query.strip():
            q = query.lower().strip()
            filtered = []
            for c in cases:
                customer = c.get("customer", {})
                searchable_text = " ".join([
                    c.get("id", ""),
                    c.get("title", ""),
                    c.get("category", ""),
                    c.get("orderId", ""),
                    c.get("complaintText", ""),
                    c.get("assignedTeam", ""),
                    c.get("assignedAgent", ""),
                    customer.get("name", ""),
                    customer.get("email", ""),
                ]).lower()
                if q in searchable_text:
                    filtered.append(c)
            cases = filtered

        # 6. Sorting
        def parse_date(date_str: str) -> float:
            if not date_str:
                return 0.0
            try:
                clean_str = date_str.replace(" ", "T")
                if len(clean_str) == 10:
                    clean_str += "T00:00:00Z"
                elif not clean_str.endswith("Z") and "+" not in clean_str:
                    clean_str += "Z"
                return datetime.fromisoformat(clean_str.replace("Z", "+00:00")).timestamp()
            except Exception:
                return 0.0

        def parse_amount(amt_str: str) -> float:
            cleaned = re.sub(r"[^0-9.]", "", str(amt_str or "0"))
            try:
                return float(cleaned)
            except ValueError:
                return 0.0

        priority_weight = {"critical": 4, "urgent": 4, "high": 3, "medium": 2, "low": 1}

        if sort_by == "date_desc":
            cases.sort(key=lambda c: parse_date(c.get("updatedAt") or c.get("createdAt") or ""), reverse=True)
        elif sort_by == "date_asc":
            cases.sort(key=lambda c: parse_date(c.get("updatedAt") or c.get("createdAt") or ""), reverse=False)
        elif sort_by == "priority_desc":
            cases.sort(key=lambda c: priority_weight.get((c.get("priority") or "").lower(), 0), reverse=True)
        elif sort_by == "amount_desc":
            cases.sort(key=lambda c: parse_amount(c.get("amount") or "0"), reverse=True)

        return cases

    def get_by_id(self, case_id: str) -> Optional[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.execute("SELECT data_json FROM cases WHERE LOWER(id) = LOWER(?)", (case_id.strip(),))
            row = cursor.fetchone()
            if not row:
                return None
            return json.loads(row["data_json"])

    def create(self, case_data: Dict[str, Any]) -> Dict[str, Any]:
        with self._get_connection() as conn:
            self._insert_row(conn, case_data)
            conn.commit()
        return case_data

    def update(self, case_id: str, case_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        with self._get_connection() as conn:
            # Check existence
            cursor = conn.execute("SELECT 1 FROM cases WHERE LOWER(id) = LOWER(?)", (case_id.strip(),))
            if not cursor.fetchone():
                return None
            self._insert_row(conn, case_data)
            conn.commit()
        return case_data

    def count(self) -> int:
        with self._get_connection() as conn:
            cursor = conn.execute("SELECT COUNT(*) FROM cases")
            return cursor.fetchone()[0]
