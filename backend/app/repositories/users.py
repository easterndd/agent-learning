from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, User)

    def find_by_username_or_email(self, value: str) -> User | None:
        statement = select(User).where(or_(User.username == value, User.email == value))
        return self.session.scalar(statement)
