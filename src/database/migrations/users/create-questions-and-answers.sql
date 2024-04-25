CREATE TYPE QUESTION_COLUMN AS ENUM(
    'NAME',
    'PRONOUN',
    'AGE',
    'LOCATION',
    'SIGN',
    'SEXUAL_ORIENTATION',
    'RELATIONSHIP',
    'MADNESS_FOR_LOVE',
    'INSTAGRAM',
    'PHOTO'
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    question VARCHAR(255) NOT NULL,
    question_column_type QUESTION_COLUMN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_chat INT,
    FOREIGN KEY (id_chat) REFERENCES chats(id)
);


CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    id_question INT,
    id_user INT,
    answer VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_question) REFERENCES questions(id),
    FOREIGN KEY (id_user) REFERENCES users(id)
);

