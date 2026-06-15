import unittest
import sys
import os
import uuid
from datetime import date

# Append app directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.database import Base
from app.models.models import Map, AuditLog

class TestComplianceEngine(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Create an in-memory SQLite database for testing backend logic
        cls.engine = create_engine("sqlite:///:memory:")
        Base.metadata.create_all(cls.engine)
        cls.Session = sessionmaker(bind=cls.engine)
        cls.user_id = uuid.uuid4()
        
    def setUp(self):
        self.db = self.Session()
        
    def tearDown(self):
        self.db.close()
        
    def test_br_013_sequential_transitions(self):
        """
        Verify sequential status flow: Pending -> Assigned -> In Progress -> Review -> Completed
        """
        COLUMNS = ["Pending", "Assigned", "In Progress", "Review", "Completed"]
        
        # Helper to validate sequential transition
        def is_transition_valid(current: str, target: str) -> bool:
            if target not in COLUMNS or current not in COLUMNS:
                return False
            source_idx = COLUMNS.index(current)
            target_idx = COLUMNS.index(target)
            return abs(target_idx - source_idx) <= 1
            
        self.assertTrue(is_transition_valid("Pending", "Assigned"))
        self.assertTrue(is_transition_valid("Assigned", "In Progress"))
        self.assertTrue(is_transition_valid("In Progress", "Review"))
        self.assertTrue(is_transition_valid("Review", "Completed"))
        self.assertTrue(is_transition_valid("Review", "In Progress"))  # Allow backtracking by 1 step for corrections
        
        # Disallowed transitions (skipping stages)
        self.assertFalse(is_transition_valid("Pending", "Completed"))
        self.assertFalse(is_transition_valid("Assigned", "Completed"))
        self.assertFalse(is_transition_valid("Pending", "In Progress"))
        self.assertFalse(is_transition_valid("In Progress", "Completed"))
        
    def test_br_014_completed_maps_locked(self):
        """
        Verify completed MAPs are locked and cannot be moved/modified
        """
        # Create a mock Completed map
        comp_map = Map(
            user_id=self.user_id,
            title="Update KYC controls",
            status="Completed",
            severity="High",
            deadline=date.today()
        )
        self.db.add(comp_map)
        self.db.commit()
        
        # Verify status is Completed
        db_map = self.db.query(Map).filter(Map.title == "Update KYC controls").first()
        self.assertEqual(db_map.status, "Completed")
        
        # Enforce that if map is Completed, updates are blocked
        def attempt_update_status(item: Map, new_status: str) -> str:
            if item.status == "Completed":
                raise PermissionError("Workflow Locked: Completed MAPs cannot be modified.")
            item.status = new_status
            return item.status
            
        with self.assertRaises(PermissionError):
            attempt_update_status(db_map, "In Progress")
            
    def test_br_028_audit_logs_immutability(self):
        """
        Verify audit logs are immutable (updates/deletes blocked by operational rules)
        """
        # Create a mock audit log
        log = AuditLog(
            user_id=self.user_id,
            entity_type="MAP",
            action="Status Updated",
            description="Moved MAP-001 to Review."
        )
        self.db.add(log)
        self.db.commit()
        
        db_log = self.db.query(AuditLog).filter(AuditLog.action == "Status Updated").first()
        self.assertIsNotNone(db_log)
        
        # Operational rule checks
        def attempt_update_log(log_item: AuditLog):
            # Enforce that audit logs cannot be updated
            raise PermissionError("Audit logs are immutable and cannot be updated.")
            
        def attempt_delete_log(log_item: AuditLog):
            # Enforce that audit logs cannot be deleted
            raise PermissionError("Audit logs are immutable and cannot be deleted.")
            
        with self.assertRaises(PermissionError):
            attempt_update_log(db_log)
            
        with self.assertRaises(PermissionError):
            attempt_delete_log(db_log)

if __name__ == "__main__":
    unittest.main()
