from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, func
from sqlalchemy.orm import Mapped, mapped_column


def new_uuid() -> str:
    return str(uuid4())


class IdMixin:
    id: Mapped[str] = mapped_column(default=new_uuid, primary_key=True)


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
