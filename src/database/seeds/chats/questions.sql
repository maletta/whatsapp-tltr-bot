INSERT INTO public.questions
(id, question, question_column_type, created_at, id_chat)
VALUES(nextval('questions_id_seq'::regclass), '\n\n•｡ꪆৎ ˚⋅ Vamos nos conhecer melhor! ౨ৎ ⋆｡˚\n\n```Responda às perguntas abaixo sem deletar as perguntas```', 'QUESTIONS_HEADER', CURRENT_TIMESTAMP, 1);

INSERT INTO public.questions
(id, question, question_column_type, created_at, id_chat)
VALUES(nextval('questions_id_seq'::regclass), '୨୧ *Nome*(Apenas o nome):', 'NAME', CURRENT_TIMESTAMP, 1);

INSERT INTO public.questions
(id, question, question_column_type, created_at, id_chat)
VALUES(nextval('questions_id_seq'::regclass), '୨୧ *Pronomes* (Quais pronomes devemos usar para você?):', 'PRONOUN', CURRENT_TIMESTAMP, 1);

INSERT INTO public.questions
(id, question, question_column_type, created_at, id_chat)
VALUES(nextval('questions_id_seq'::regclass), '୨୧ *Idade* (Quantos anos você tem?):', 'AGE', CURRENT_TIMESTAMP, 1);

INSERT INTO public.questions
(id, question, question_column_type, created_at, id_chat)
VALUES(nextval('questions_id_seq'::regclass), '୨୧ *Localização em SP* (De qual parte você é?):', 'LOCATION', CURRENT_TIMESTAMP, 1);

INSERT INTO public.questions
(id, question, question_column_type, created_at, id_chat)
VALUES(nextval('questions_id_seq'::regclass), '୨୧ *Signo* (Qual é o seu signo do zodíaco?):', 'SIGN', CURRENT_TIMESTAMP, 1);

INSERT INTO public.questions
(id, question, question_column_type, created_at, id_chat)
VALUES(nextval('questions_id_seq'::regclass), '୨୧ *Orientação Sexual* (Como você se identifica?):', 'SEXUAL_ORIENTATION', CURRENT_TIMESTAMP, 1);

INSERT INTO public.questions
(id, question, question_column_type, created_at, id_chat)
VALUES(nextval('questions_id_seq'::regclass), '୨୧ *Relacionamento* (Está namorando? Já superou o/a ex?):', 'RELATIONSHIP', CURRENT_TIMESTAMP, 1);

INSERT INTO public.questions
(id, question, question_column_type, created_at, id_chat)
VALUES(nextval('questions_id_seq'::regclass), '୨୧ *Loucura por Amor* (Já fez alguma? Conte-nos!):', 'MADNESS_FOR_LOVE', CURRENT_TIMESTAMP, 1);

INSERT INTO public.questions
(id, question, question_column_type, created_at, id_chat)
VALUES(nextval('questions_id_seq'::regclass), '୨୧ *Instagram* (Qual é o seu @, se quiser compartilhar):', 'INSTAGRAM', CURRENT_TIMESTAMP, 1);

INSERT INTO public.questions
(id, question, question_column_type, created_at, id_chat)
VALUES(nextval('questions_id_seq'::regclass), '୨୧ *Foto* (Envie uma unidade de foto sua):', 'PHOTO', CURRENT_TIMESTAMP, 1);
