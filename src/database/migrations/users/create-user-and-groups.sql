CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	id_whatsapp VARCHAR(100) NOT NULL,
	cellphone VARCHAR(20) NOT NULL,
	info_name VARCHAR(50) NOT NULL
)


CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    id_whatsapp VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_in_chats(
    id_user VARCHAR(50) NOT NULL,
    id_chat VARCHAR(50) NOT NULL,
    deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    PRIMARY KEY (id_user, id_chat),
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (id_chat) REFERENCES chats(id)
)