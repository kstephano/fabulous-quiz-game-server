TRUNCATE users, lobbies RESTART IDENTITY;

INSERT INTO users (username, score, lobby_id)
VALUES
    ('Beth', 0.72, 1),
    ('Naz', 0.4, 1),
    ('Rhys', 0.4, 1),
    ('Peter', 0.9, 2),
    ('Kelvin', 0.8, 2),
    ('Rhys', 0.74, 3),
    ('Emily', 0.9, 3);


INSERT INTO lobbies (category)
VALUES
    ('Entertainment: Movies'),
    ('General Knowledge'),
    ('Sports');
