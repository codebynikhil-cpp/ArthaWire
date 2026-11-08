"""
FinPulse Alerts & Notifications Router
Manages user alert configurations and real-time notification feeds.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models.alert import AlertRule, Notification
from app.schemas.alert import AlertRuleCreate, AlertRuleResponse, NotificationResponse

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("/rules", response_model=List[AlertRuleResponse])
def get_alert_rules(db: Session = Depends(get_db)):
    """Retrieves all configured alert rules."""
    rules = db.query(AlertRule).order_by(desc(AlertRule.created_at)).all()
    return rules

@router.post("/rules", response_model=AlertRuleResponse)
def create_alert_rule(payload: AlertRuleCreate, db: Session = Depends(get_db)):
    """Creates a new alert rule."""
    rule = AlertRule(
        name=payload.name,
        rule_type=payload.rule_type,
        criteria=payload.criteria,
        is_active=payload.is_active
    )
    db.add(rule)
    db.commit()
    db.refresh(rule)
    return rule

@router.patch("/rules/{rule_id}", response_model=AlertRuleResponse)
def toggle_alert_rule(rule_id: int, is_active: Optional[bool] = None, db: Session = Depends(get_db)):
    """Toggles or updates an alert rule."""
    rule = db.query(AlertRule).filter(AlertRule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Alert rule not found")
    
    if is_active is not None:
        rule.is_active = is_active
    db.commit()
    db.refresh(rule)
    return rule

@router.delete("/rules/{rule_id}")
def delete_alert_rule(rule_id: int, db: Session = Depends(get_db)):
    """Deletes an alert rule."""
    rule = db.query(AlertRule).filter(AlertRule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Alert rule not found")
    
    db.delete(rule)
    db.commit()
    return {"status": "success", "message": "Alert rule deleted"}

@router.get("/notifications", response_model=List[NotificationResponse])
def get_notifications(
    unread_only: bool = False,
    limit: int = Query(30, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Retrieves triggered notifications feed."""
    query = db.query(Notification)
    if unread_only:
        query = query.filter(Notification.is_read == False)
    notifications = query.order_by(desc(Notification.created_at)).limit(limit).all()
    return notifications

@router.patch("/notifications/{notification_id}/read")
def mark_notification_as_read(notification_id: int, db: Session = Depends(get_db)):
    """Marks a single notification as read."""
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.is_read = True
    db.commit()
    return {"status": "success", "id": notification_id, "is_read": True}

@router.post("/notifications/read-all")
def mark_all_notifications_as_read(db: Session = Depends(get_db)):
    """Marks all unread notifications as read."""
    db.query(Notification).filter(Notification.is_read == False).update({"is_read": True})
    db.commit()
    return {"status": "success", "message": "All notifications marked as read"}

