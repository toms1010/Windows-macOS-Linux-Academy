# AI Generation (status: NOT implemented — by design)

Target architecture (implement when a backend exists):

```text
GeneratorPanel (mode=ai)
 ↓
question.service.requestAI  (currently returns { ok:false })
 ↓ (future)
Supabase Edge Function (secret key server-side ONLY)
 ↓
AI Provider → required JSON: question/type/options/correctAnswer/
              explanation/hint/difficulty/topic
 ↓
validateQuestion() + id/text/fact duplicate checks → discard invalid
 ↓
Preview (labelled ✨ AI) → Add to Quiz (source:'ai')
```

Rules (already enforced in UI/service): explicit mode selector; no silent
fallback (failure panel offers [Use Local Questions]/[Try AI Again]/[Cancel]);
offline AI requests fail closed with a local-use offer; preview and results
always attribute source (⚡ Local / ✨ AI / 📝 Author); attempts record
`generation_mode`. Never put `*_API_KEY` or service-role keys in frontend
code or `.env.example` values.
