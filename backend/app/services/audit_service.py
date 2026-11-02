import json
from typing import Optional, Any
from sqlalchemy.orm import Session
from app.models.audit import AuditLog

def record_audit_log(
    db: Session,
    action: str,
    admin_id: Optional[int] = None,
    target_user_id: Optional[int] = None,
    details: Any = None
) -> AuditLog:
    """
    Creates an immutable audit log entry.
    """
    if isinstance(details, (dict, list)):
        details_str = json.dumps(details)
    elif details is None:
        details_str = "{}"
    else:
        details_str = str(details)

    log_entry = AuditLog(
        admin_id=admin_id,
        action=action,
        target_user_id=target_user_id,
        details=details_str
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    return log_entry

