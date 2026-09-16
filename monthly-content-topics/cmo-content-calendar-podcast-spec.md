# Spec: CMO agent — monthly content calendar options + podcast pathing

**For:** Alex Sazonenka (Ability.ai)  
**From:** Daniel Torsak / Ava (PO) with Atlas (mechanics draft)  
**Date:** 2026-09-16  
**Status:** Ready for Alex feedback (Atlas fidelity pass + CMO repo router 2026-09-16) — not live yet  
**Related agents:** CMO (marketing intelligence), Cornelius (ICP source of truth)  
**Related human:** Rachel (Growth & Marketing Strategy Lead) owns execution and rock approval

---

## 1. Problem

Rachel needs a repeatable monthly system for podcast (new-business) and parallel existing-client content (newsletter / livestream) that:

1. Starts from **Cornelius ICP facts**, not calendar brainstorm alone
2. Produces **scored topic options / topic cards** she can light-edit
3. Feeds **Zoom Workplace Polls** (humans rank; agents do not run or replace the poll)
4. Closes the loop with a **post-publish measurement brief** into next month

Today CMO can report and brief. It does not yet own this monthly option-list + measurement handoff as a clear skill path with Cornelius.

---

## 2. Out of scope (month one)

Do **not** build these into the first CMO increment:

- Education center / advisor-attributed content library
- Calculator / exercise / lightweight app builds
- Full content hub that scrapes Trinity or replaces Zoom intake
- Live Zoom poll creation by agents
- Messaging Rachel or wealth strategists from agents

Riverside MCP was previously discussed for CMO (~2026-09-04). Confirm separately whether it remains on the path; it is **not** required for this content-calendar / topic-options loop.

**Human Zoom poll extras (not agent fields):** Each poll also asks wealth strategists for (a) resources they already send clients and (b) tools / calculators / demos that made a topic click. Those answers are **human discovery only**. They are not CMO topic-card fields and agents do not collect them.

---

## 3. Role boundaries

| Actor | Owns | Does not own |
|-------|------|----------------|
| **Cornelius** | ICP pack: segments, pains, market language, stale/gap flags | Episode titles, poll posting, production |
| **CMO** | Monthly topic options / topic cards; post-publish measurement brief; consumes Cornelius + performance history | Parallel ICP model; Zoom poll; Rachel’s lock/produce |
| **Rachel** | Light edit, polls (after template), lock topics, produce, scoreboard row, post-lock “what’s going out” format | Inventing ICP facts |
| **Dan** | Mechanics draft; first human pass / poll template help | Long-term rock ownership (Rachel) |

---

## 4. Monthly loop (desired agent behavior)

Cadence: **month-to-month starting October** (not a full-year lock). Calendar (Patrick / Rachel year-end doc) is a **constraint**, not the only source.

```
Cornelius ICP pack
        ↓
CMO topic options / topic cards (6–10)
        ↓
Human light edit (Dan/Rachel)
        ↓
Two Zoom Workplace Polls (new business | existing clients)  ← humans only
        ↓
Rachel locks → produces / publishes
        ↓
CMO measurement brief → next month’s CMO options
```

### Track split

- **Podcast path** = **new-business** track output (Rock A).
- **Existing-client** track = newsletter + livestream themes (Rock B), **separate** poll, same CMO skill family with a channel tag.

### Parallel human pack (not a new month-one skill unless Alex wants it)

Living one-pager **“Our five ICPs — current”** drafted by CMO + Cornelius for marketing + sales. Distinct from the monthly ICP pack (§5.1). Keep as a readable human reference; HubSpot contact tags remain separate.

---

## 5. Skills / A2A asks to implement on CMO (and Cornelius)

### 5.1 Skill: `monthly-icp-pack` (Cornelius)

**Trigger:** Scheduled or operator-invoked before monthly planning.  
**Input:** Target month; whether new vs existing ICPs differ.  
**Output (structured):**

1. Active ICPs / segments for the month (new vs existing if different)
2. Per ICP: top pains, market language, what they care about now
3. Stale / weak / conflicting ICP notes
4. Explicit: facts only from ICP source of truth; **no episode titles**

### 5.2 Skill: `monthly-topic-options` (CMO)

**Trigger:** After ICP pack available (A2A from Cornelius or attached pack).  
**Input:** Month; Cornelius ICP pack; recent performance history CMO already trusts; optional calendar constraints.  
**Output:** 6–10 topic **cards** (see schema §6).  
**Also:**

- Flag thin ICP coverage
- Suggest weakest 1–2 cuts if list must shrink to 6
- Leave room for open-ended WS write-in (do **not** invent write-in text)
- Do **not** run Zoom poll or message Rachel

### 5.3 Skill: `post-publish-measurement` (CMO)

**Trigger:** After month’s podcast / newsletter / livestreams ship.  
**Output:** One short brief:

- What performed (trusted metrics only)
- Map top/bottom to prior topic options + ICP rationale
- 2–3 adjustments for next month’s options (still grounded in Cornelius)

---

## 6. Topic-card schema (CMO emit)

| Field | Required | Notes |
|-------|----------|--------|
| `title` | yes | Short working title (poll shows this) |
| `channel` | yes | `podcast` \| `newsletter` \| `live_stream` |
| `track` | yes | `new_business` \| `existing_client` |
| `icp_primary` | yes | Trace to Cornelius; no invented ICP |
| `icp_secondary` | no | Optional |
| `whats_in_it` | yes | 2–4 bullets |
| `example` | yes | One sentence sales can grasp |
| `icp_rationale` | yes | One line “why this ICP” from Cornelius |
| `confidence` | yes | `high` \| `medium` \| `low` (+ why if low) |
| `calendar_notes` | no | Constraint only (timing / conflicts) |

Poll UX: short titles in Zoom; full cards on companion Notion/Drive one-pager linked from the Zoom Team Chat message that opens the poll (human-operated).

---

## 7. How this relates to existing `/contentcalendar` (CMO repo)

Reviewed live skill in `ParadigmLife/cmo-paradigm-life` (`.claude/skills/contentcalendar/SKILL.md`).

**Today’s `/contentcalendar` is Path A — campaign calendar:**
1. Phase 1: ranked **theme** candidates → human picks theme
2. Phase 2: Master Calendar Brief + multi-channel **month slots**
3. Podcast already exists as Phase 2 **slots** via `/contentcalendar set-podcast-weeks 1,3` (default = prep-only, no episodes)
4. Separate skill `/generate-podcast-brief` = episode production brief once a topic exists (data + Cornelius), **not** the Zoom WS force-rank loop

**This spec’s monthly topic options is Path B — not the same machine:**
Cornelius ICP pack → CMO topic cards → human Zoom polls → Rachel locks topics → then `/generate-podcast-brief` (and/or feed locked titles into Path A weeks).

Do **not** silently fold Path B into Phase 1 of Path A. Themes-for-a-full-calendar and ranked-episode-options-for-WS-polls are different products.

### Recommended front door (router)

Add a thin entry (extend `/contentcalendar` Step 1 argument routing, or a parent `/content-planning`) that asks:

> What do you want to run?
> 1. **Campaign calendar** — theme → multi-channel month plan (today’s `/contentcalendar`)
> 2. **Monthly topic options** — podcast / existing-client topic cards for Zoom polls (this spec)

| Path | Skill surface | Output |
|------|---------------|--------|
| A Campaign calendar | Existing `/contentcalendar` Phases 1–2 | Theme Brief + Master Calendar + slots; optional podcast weeks |
| B Monthly topic options | New: §5.1–5.3 (+ human polls outside agent) | ICP pack → topic cards → (humans poll) → lock; then hand off to `/generate-podcast-brief` or Path A `set-podcast-weeks` |

### Path B channel options (within mode 2)

Once Path B is selected:

1. **Default:** Cornelius → CMO cards → human edit → Zoom poll → Rachel lock → produce
2. **Calendar-constrained:** Same, but respect known calendar blocks when scoring/ordering
3. **Podcast-first (month one):** `channel=podcast` + `track=new_business`
4. **Parallel existing:** `newsletter` / `live_stream` + `existing_client`; separate human poll

Rachel’s post-lock awareness format remains human process, not a CMO skill.

---

## 8. Acceptance criteria (for Ability)

- [ ] Cornelius can return a monthly ICP pack matching §5.1 without proposing titles
- [ ] CMO can return 6–10 topic cards matching §6 from that pack + performance history
- [ ] Podcast path clearly selectable (`channel=podcast`, `track=new_business`)
- [ ] Existing-client options labeled separately (not mixed into one undifferentiated list without `track` / `channel`)
- [ ] Post-publish measurement brief available as a distinct skill
- [ ] No agent creates Zoom polls, messages WS, or invents ICP facts
- [ ] Handoff Cornelius → CMO is documented (A2A or file attachment); example prompts available for operator use until A2A is live (Rachel may modify)
- [ ] Operator can choose Path A (campaign calendar) vs Path B (monthly topic options) without Path B mutating Path A theme state by accident
- [ ] Path B does not create Zoom polls or message wealth strategists

---

## 9. Example operator prompts (interim until skills are wired)

**Examples only.** Rachel may modify or replace these in Trinity. Do not hard-code them as the only allowed prompt text. Example prompt text (Ask Cornelius / Ask CMO options / Ask CMO measure) lives in:

- Box: `q4-marketing-rocks/q4-marketing-rock-draft-zoom-polls.md`
- Live: https://dparadigm.github.io/monthly-content-topics/q4-marketing-rock-draft.md
- Site: Month 1 resources → Trinity prompt examples

Fine as smoke-test starters; Rachel owns the final prompts she runs.

---

## 10. Open questions for Alex

1. Prefer **A2A** (CMO requests Cornelius) vs scheduled Cornelius file/snapshot CMO reads (same pattern Ability suggested for Wingman ↔ CMO)? Note: CMO already has `/cornelius-query` async+poll for briefs.
2. Where should topic-card JSON / markdown land for humans (Drive folder, agent files API, both)?
3. Is Riverside MCP still in scope for CMO production later, or explicitly out of this content-planning increment?
4. **Router shape:** Extend `/contentcalendar` Step 1 with a mode prompt, add a parent `/content-planning` skill, or keep Path B as separate slash commands only?
5. For Path B → production: after Rachel locks topics, should agents auto-call `/generate-podcast-brief`, only write locked titles into calendar state for Path A, or leave handoff fully human?
6. Any existing CMO skill we should extend vs new skills named as in §5?

---

## 11. References

- Internal draft: `/workspace/q4-marketing-rocks/q4-marketing-rock-draft-zoom-polls.md`
- Public draft: https://dparadigm.github.io/monthly-content-topics/q4-marketing-rock-draft.md
- Walkthrough: https://dparadigm.github.io/monthly-content-topics/
- Ability weekly 2026-09-16: Daniel committed to send Alex content-calendar / podcast workflow documentation

