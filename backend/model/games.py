class Quiz:
    def __init__(self, id: int, question: str, selects: list, answer_idx: int, likes: int=0) -> None:
        self.id = id
        self.question = question
        self.selects = selects
        self.answer_idx = answer_idx
        self.likes = likes

    # TODO: __repr__(self)をつくる

class IntroDon:
    def __init__(self, game_id: int, question: str, selects: list, answer: str, likes: int=0) -> None:
        self.game_id = game_id
        self.question = question
        self.selects = selects
        self.answer = answer
        self.likes = likes