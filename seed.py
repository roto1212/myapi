# from database import SessionLocal
# from models import Question
# from datetime import datetime

# db = SessionLocal()

# for i in range(300):
#     q = Question(subject="테스트데이터 입니다.", content="냉무", created_date=datetime.now())
#     db.add(q)

# db.commit()

from database import SessionLocal
db = SessionLocal()
from models import Question, Answer, User

print("question count:", db.query(Question).count())
print("answer count:", db.query(Answer).count())

print("question join answer:", db.query(Question).join(Answer).count())
print("question outerjoin answer:", db.query(Question).outerjoin(Answer).count())
print("question outerjoin answer distinct:", db.query(Question).outerjoin(Answer).distinct().count())

print("파이썬 포함 검색:", db.query(Question).outerjoin(Answer).filter(
    Question.content.ilike('%파이썬%') |
    Answer.content.ilike('%파이썬%')
).distinct().count())

작성자검색 = db.query(Answer.question_id, Answer.content, User.username)\
.outerjoin(User, Answer.user_id == User.id).subquery()

print(작성자검색)
print(db.query(작성자검색).count())

서브쿼리결과 = db.query(Question).outerjoin(작성자검색, 작성자검색.c.question_id == Question.id).distinct()
print(서브쿼리결과)
print(서브쿼리결과.count())
