-- ============================================
-- MIGRACIÓN DE BASE DE DATOS - PASO 1
-- Agregar nuevos campos y crear tabla Messages
-- ============================================

-- 1. Agregar campo tipo_usuario a User
ALTER TABLE public."User"
ADD COLUMN IF NOT EXISTS tipo_usuario VARCHAR(50) DEFAULT 'cliente';

-- 2. Agregar campos asignadoA y prioridad a Ticket
ALTER TABLE public."Ticket"
ADD COLUMN IF NOT EXISTS "asignadoA" INTEGER,
ADD COLUMN IF NOT EXISTS prioridad VARCHAR(50) DEFAULT 'normal';

-- 3. Crear tabla Messages (nueva estructura para almacenar mensajes individuales)
CREATE TABLE IF NOT EXISTS public."Message" (
  id SERIAL PRIMARY KEY,
  "chatId" INTEGER NOT NULL REFERENCES public."Chat"(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  "imageUrl" VARCHAR(500),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Crear índice para búsquedas rápidas por chatId
CREATE INDEX IF NOT EXISTS idx_message_chatid ON public."Message"("chatId");
CREATE INDEX IF NOT EXISTS idx_message_timestamp ON public."Message"(timestamp);

-- 5. Migrar datos existentes de Chat.messages (JSON) a tabla Message
-- Este script extrae cada mensaje del array JSON y lo inserta en la tabla Message
DO $$
DECLARE
  chat_record RECORD;
  message_json JSONB;
  message_index INT;
BEGIN
  FOR chat_record IN SELECT id, messages FROM public."Chat" WHERE messages IS NOT NULL AND array_length(messages, 1) > 0
  LOOP
    FOR message_index IN 1..array_length(chat_record.messages, 1)
    LOOP
      message_json := chat_record.messages[message_index];
      
      INSERT INTO public."Message" ("chatId", content, "imageUrl", timestamp)
      VALUES (
        chat_record.id,
        message_json->>'content',
        message_json->>'imageUrl',
        COALESCE((message_json->>'timestamp')::TIMESTAMP, CURRENT_TIMESTAMP)
      );
    END LOOP;
  END LOOP;
END $$;

-- 6. Remover columna messages de Chat (ya no es necesaria)
ALTER TABLE public."Chat"
DROP COLUMN IF EXISTS messages;

-- 7. Verificar que la migración fue exitosa
SELECT 
  'Usuarios con tipo_usuario' as verificacion,
  COUNT(*) as total
FROM public."User"
WHERE tipo_usuario IS NOT NULL
UNION ALL
SELECT 
  'Tickets con prioridad',
  COUNT(*)
FROM public."Ticket"
WHERE prioridad IS NOT NULL
UNION ALL
SELECT 
  'Mensajes migrados',
  COUNT(*)
FROM public."Message";

COMMIT;
