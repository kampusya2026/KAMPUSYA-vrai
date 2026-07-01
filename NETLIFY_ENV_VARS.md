# Variables d'environnement à ajouter dans Netlify

Aller dans : Netlify → votre site → **Site configuration → Environment variables → Add a variable**

Ajouter ces deux variables (une à la fois) :

| Clé | Valeur |
|---|---|
| `SUPABASE_URL` | `https://nzldrgzxtciuktyxsjdx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56bGRyZ3p4dGNpdWt0eXhzamR4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mjg1MzgyOSwiZXhwIjoyMDk4NDI5ODI5fQ.8TYVTJQc6cyjuCteTvsQukGEJn09LWex74g9sr3tw1s` |

## Important — cette clé a été partagée en clair dans une conversation

Par prudence, une fois qu'elle est copiée dans Netlify (Environment variables), régénère cette clé depuis Supabase : **Project Settings → API → Project API keys → service_role → Regenerate**. Ça invalide l'ancienne (donc celle ci-dessus, une fois que tu ne t'en sers plus) et en génère une nouvelle à remettre dans Netlify. Deux minutes, et ça évite qu'une copie de cette clé traîne quelque part en dehors de Netlify.
