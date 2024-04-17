CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    id_question INT,
    id_user INT,
    answer VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_question) REFERENCES questions(id),
    FOREIGN KEY (id_user) REFERENCES users(id)
);